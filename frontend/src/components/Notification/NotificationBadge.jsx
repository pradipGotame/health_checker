import { useState, useEffect } from 'react';
import { 
  Badge, 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  Box, 
  ClickAwayListener,
  Button,
  Stack,
  Divider
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../../hooks/useAuth';
import { 
  getUnseenNotificationsCount, 
  markNotificationsAsSeen, 
  getNotifications,
  deleteNotification,
  markNotificationAsSeen
} from '../../firebase/firebase';
import { format } from 'date-fns';

export default function NotificationBadge() {
  const { user } = useAuth();
  const [unseenCount, setUnseenCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const count = await getUnseenNotificationsCount(user.uid);
      setUnseenCount(count);
      
      const allNotifications = await getNotifications(user.uid);
      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (user) {
      // Initial fetch
      fetchNotifications();
      
      // Set up interval to check for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async () => {
    try {
      if (user && anchorEl) {
        setIsLoading(true);
        await markNotificationsAsSeen(user.uid);
        setUnseenCount(0);
      }
    } catch (error) {
      console.error('Error marking notifications as seen:', error);
    } finally {
      setIsLoading(false);
      setAnchorEl(null);
    }
  };

  const handleClickAway = () => {
    handleClose();
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      // Update unseen count
      setUnseenCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsSeen(notificationId);
      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, seen: true } : n
      ));
      // Update unseen count
      setUnseenCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <IconButton 
          color="inherit" 
          onClick={handleClick}
          disabled={isLoading}
        >
          <Badge badgeContent={unseenCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              maxHeight: 400,
              width: 360,
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Notifications</Typography>
              {notifications.length > 0 && (
                <Button 
                  size="small" 
                  onClick={handleClose}
                  startIcon={<CheckCircleIcon />}
                >
                  Mark all as read
                </Button>
              )}
            </Stack>
          </Box>
          {notifications.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                No notifications
              </Typography>
            </MenuItem>
          ) : (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 1,
                  py: 2,
                  px: 2,
                  maxWidth: '300px',
                  whiteSpace: 'normal',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.primary',
                      wordBreak: 'break-word',
                      lineHeight: 1.4,
                      mb: 1,
                    }}
                  >
                    {notification.message}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      mb: 1,
                    }}
                  >
                    {format(notification.createdAt.toDate(), 'MMM d, yyyy h:mm a')}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      width: '100%',
                      justifyContent: 'flex-end',
                      mt: 1,
                    }}
                  >
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.1)',
                        },
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.1)',
                        },
                      }}
                    >
                      Mark as Read
                    </Button>
                  </Stack>
                </Box>
              </MenuItem>
            ))
          )}
        </Menu>
      </div>
    </ClickAwayListener>
  );
} 