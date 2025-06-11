import { useState, useRef } from 'react';
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
  Skeleton,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import VideoCard from './VideoCard';

interface Video {
  id: string;
  thumbnail: string;
  title: string;
  publishDate: string;
  duration: string;
}

interface VideoCarouselProps {
  title: string;
  videos: Video[];
  loading?: boolean;
  onPlayVideo: (videoId: string) => void;
  onVideoInfo: (videoId: string) => void;
}

const VideoCarousel = ({
  title,
  videos,
  loading = false,
  onPlayVideo,
  onVideoInfo,
}: VideoCarouselProps) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Calculate the number of skeleton items to show based on viewport
  const getSkeletonCount = () => {
    if (isMobile) return 1.5;
    return 4;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        py: 4,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 3,
          pl: 2,
        }}
      >
        {title}
      </Typography>

      <Box sx={{ position: 'relative' }}>
        {/* Left Arrow */}
        <Fade in={!isMobile && isHovered && showLeftArrow}>
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
        </Fade>

        {/* Right Arrow */}
        <Fade in={!isMobile && isHovered && showRightArrow}>
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Fade>

        {/* Scrollable Container */}
        <Box
          ref={scrollContainerRef}
          onScroll={handleScroll}
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            px: 2,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '& > *': {
              flex: {
                xs: '0 0 85%',
                sm: '0 0 45%',
                md: '0 0 30%',
                lg: '0 0 23%',
              },
            },
          }}
        >
          {loading
            ? Array.from({ length: getSkeletonCount() }).map((_, index) => (
                <Box key={index} sx={{ width: '100%' }}>
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      width: '100%',
                      paddingTop: '56.25%',
                      borderRadius: 2,
                    }}
                  />
                  <Box sx={{ pt: 1 }}>
                    <Skeleton width="80%" height={24} />
                    <Skeleton width="40%" height={20} />
                  </Box>
                </Box>
              ))
            : videos.length > 0
            ? videos.map((video) => (
                <VideoCard
                  key={video.id}
                  thumbnail={video.thumbnail}
                  title={video.title}
                  publishDate={video.publishDate}
                  duration={video.duration}
                  onPlay={() => onPlayVideo(video.id)}
                  onInfo={() => onVideoInfo(video.id)}
                />
              ))
            : (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                }}
              >
                <Typography color="text.secondary">
                  No videos available
                </Typography>
              </Box>
            )}
        </Box>
      </Box>
    </Box>
  );
};

export default VideoCarousel; 