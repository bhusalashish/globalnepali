import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Fade,
} from '@mui/material';
import { PlayCircle, Info } from '@mui/icons-material';

interface VideoCardProps {
  thumbnail: string;
  title: string;
  publishDate: string;
  duration: string;
  onPlay: () => void;
  onInfo: () => void;
}

const VideoCard = ({
  thumbnail,
  title,
  publishDate,
  duration,
  onPlay,
  onInfo,
}: VideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      sx={{
        position: 'relative',
        width: '100%',
        bgcolor: 'background.paper',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        '&:hover': {
          boxShadow: 20,
          zIndex: 1,
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={thumbnail}
          alt={title}
          sx={{
            height: 0,
            paddingTop: '56.25%', // 16:9 aspect ratio
            position: 'relative',
          }}
        />
        
        {/* Duration Badge */}
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            bgcolor: 'rgba(0, 0, 0, 0.75)',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            zIndex: 1,
          }}
        >
          {duration}
        </Typography>

        {/* Hover Overlay */}
        <Fade in={isHovered}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <IconButton
              onClick={onPlay}
              sx={{
                color: 'white',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: 'primary.main',
                },
              }}
            >
              <PlayCircle sx={{ fontSize: 48 }} />
            </IconButton>
            <IconButton
              onClick={onInfo}
              sx={{
                color: 'white',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: 'primary.main',
                },
              }}
            >
              <Info sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>
        </Fade>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '48px',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            mt: 0.5,
          }}
        >
          {publishDate}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoCard; 