import NavBar from '../Landing/NavBar'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { Typography } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList';

export default function WorkoutHistoryPage() {
    return(<>
    <NavBar/>
    <Container>
        <Stack>Log New Activities</Stack>
        <Stack>Workout Streak</Stack>
        <Stack>
            <Typography>Today's Activity</Typography>
            <Stack sx={{borderRadius: '8px'}}>
            </Stack>
        </Stack>

        <Stack>
            <Typography>Previous Activities</Typography><FilterListIcon/>
        </Stack>

    </Container>
    </>)
}