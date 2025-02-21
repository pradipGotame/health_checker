import { Box, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import GenderSelection from "../GenderSelection";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FitnessGoal from "../FitnessGoal";
import AgeSelect from "../Age";
import HeightInput from "../Height";
import WeightInput from "../Weight";
import ActivityType from "../ActivityType";
import ExerciseLevel from "../ExerciseLevel";
import Location from "../Location";

export default function Profile() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box
        sx={{
          height: "auto",
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          borderRadius: "16px",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex", // 让内部 Box 水平排列
            flexDirection: "row",
            gap: 3, // 控制左右间距
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 0, // 控制 Avatar 和 Username 之间的距离
              padding: 2,
              backgroundColor: "background.paper",
              borderRadius: 2,
              minHeight: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1, // 控制 Avatar 和 Username 之间的距离
                padding: 8,
                backgroundColor: "background.paper",
                width: "fit-content",
                flexShrink: 0, // 防止缩小
                alignItems: "center",
                minHeight: 0,
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                }}
                src="https://github.com/shadcn.png"
                alt="User Name"
              />
              <Typography
                sx={{
                  display: "flex",
                  fontSize: "1.5rem",
                  color: "text.primary",
                  whiteSpace: "nowrap", // 避免换行
                }}
              >
                Username
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                padding: 4,
                flexDirection: "column",
                flexGrow: 1,
                minWidth: "35vh",
                height: "auto",
                minHeight: 0,
              }}
            >
              <Typography>Fitness Goal</Typography>
              <FitnessGoal />

              <HeightInput />

              <WeightInput />
            </Box>
            <Typography>Name</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                padding: 4,
                flexDirection: "column",
                flexGrow: 1,
                minWidth: "35vh",
                height: "auto",
                minHeight: 0,
              }}
            >
              <TextField
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  width: "100%",
                }}
                multiline // 让输入框支持多行
                maxRows={3}
                id="outlined-read-only-input"
                label="Name"
                defaultValue="User's Name ( from database )"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
              <Typography>Age</Typography>
              <AgeSelect />

              <GenderSelection />
            </Box>
          </Box>

          {/* <Box
          sx={{
            display: "inline-flex	",
            justifyContent: "flex-start", // 这里也设为 flex-start
            gap: 20,
            padding: 2,
            width: "100%", // 让 Box 占满整个 Card 的宽度
          }}
        >
          <TextField
            id="outlined-email-input"
            label="Email"
            type="email"
            autoComplete="current-email"
            sx={{ width: "45%" }}
          />
        </Box> */}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            position: "absolute",
            bottom: 16,
            right: 16,
          }}
        >
          <Stack direction="column" spacing={2}>
            <Button variant="contained" size="small">
              Save
            </Button>
          </Stack>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          //width: "100%",
          gap: 3,
        }}
      >
        <Box
          variant="outlined"
          sx={{
            //height: "auto",
            //width: "100%",
            display: "flex",
            alignItems: "flex-start",
            borderRadius: "16px",
            position: "relative",
            padding: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              padding: 1,
              flexDirection: "column",
              flexGrow: 1,
              minWidth: "35vh",
              height: "auto",
              minHeight: 0,
            }}
          >
            <Typography>Name</Typography>
            <TextField
              sx={{
                flexGrow: 1,
                flexShrink: 1,
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                width: "100%",
              }}
              multiline // 让输入框支持多行
              maxRows={3}
              id="outlined-read-only-input"
              label="Name"
              defaultValue="User's Name ( from database )"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
            <Typography>Age</Typography>
            <AgeSelect />

            <GenderSelection />
          </Box>
        </Box>
        <Box
          variant="outlined"
          sx={{
            //height: "auto",
            width: "50%",
            display: "flex",
            alignItems: "flex-start",
            borderRadius: "16px",
            position: "relative",
            padding: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              padding: 1,
              flexDirection: "column",
              flexGrow: 1,
              minWidth: "35vh",
              height: "auto",
              minHeight: 0,
            }}
          >
            <Typography>Preffered Activity Type</Typography>
            <ActivityType />

            <Typography>Activity Level</Typography>
            <ExerciseLevel />

            <Typography>Location</Typography>
            <Location />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
