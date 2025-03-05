import { useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Badge,
  Paper,
  Divider,
} from "@mui/material";
import { Notifications, CheckCircle, Delete } from "@mui/icons-material";

const Notification = () => {
  // Mock notifications data
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New message from John", read: false },
    { id: 2, text: "Your order has been shipped", read: false },
    { id: 3, text: "Reminder: Meeting at 3 PM", read: true },
    { id: 4, text: "Your payment was successful", read: false },
  ]);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Delete a notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <Container sx={{ mt: 4 }} style={{ marginTop: 120 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: "10px" }}>
        <Typography
          variant="h5"
          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <Notifications fontSize="large" />
          </Badge>
          Notifications
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          {notifications.length === 0 ? (
            <Typography variant="body1" align="center">
              No notifications available
            </Typography>
          ) : (
            notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  bgcolor: notification.read ? "grey.100" : "white",
                  borderRadius: "5px",
                  mb: 1,
                  boxShadow: notification.read
                    ? "none"
                    : "2px 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <ListItemText
                  primary={notification.text}
                  sx={{ color: notification.read ? "gray" : "black" }}
                />
                <IconButton
                  color="success"
                  onClick={() => markAsRead(notification.id)}
                >
                  <CheckCircle />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => deleteNotification(notification.id)}
                >
                  <Delete />
                </IconButton>
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default Notification;
