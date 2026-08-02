import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Button,
    Tooltip,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Divider,
    Chip
} from '@mui/material';
import {
    DarkMode,
    LightMode,
    Menu as MenuIcon,
    Close as CloseIcon,
    Home as HomeIcon,
    LocalOffer as SetIcon,
    PrivacyTip as PrivacyIcon,
    CollectionsBookmark as BinderIcon,
    FavoriteBorder as WantIcon,
    History as HistoryIcon,
} from '@mui/icons-material';
import { formatTimestamp } from "../../utils/helpers.js";
import { useThemeMode } from "../../contexts/ThemeContext.jsx";
import LoginButton from "../auth/LoginButton.jsx";

const Header = ({ lastUpdatedTimestamp, sets = [], currentView = { type: 'home' }, onNavigate }) => {
    const { isDark, toggleMode } = useThemeMode();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (view) => {
        setDrawerOpen(false);
        if (location.pathname !== '/') {
            navigate('/');
        }
        // Defer so Home mounts before view change when coming from another route.
        if (onNavigate) {
            setTimeout(() => onNavigate(view), 0);
        }
    };

    const handleRoute = (path) => {
        setDrawerOpen(false);
        navigate(path);
    };

    const navButtonSx = (active) => ({
        display: { xs: 'none', sm: 'inline-flex' },
        color: active ? '#ffffff' : '#d4a853',
        fontWeight: active ? 700 : 600,
        fontSize: '0.875rem',
        textTransform: 'none',
        minWidth: 0,
        px: 1,
        py: 0.35,
        whiteSpace: 'nowrap',
        backgroundColor: active ? 'rgba(212, 168, 83, 0.25)' : 'transparent',
        '&:hover': {
            backgroundColor: 'rgba(212, 168, 83, 0.15)',
        },
    });

    return (
        <>
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    background: 'linear-gradient(135deg, #0a2540 0%, #0d3050 50%, #1a4a6e 100%)',
                    borderBottom: '2px solid #d4a853',
                    boxShadow: '0 2px 10px rgba(10, 37, 64, 0.45)'
                }}
            >
                <Toolbar
                    variant="dense"
                    sx={{
                        px: { xs: 0.75, sm: 1.5, md: 2 },
                        py: 0.5,
                        minHeight: { xs: 48, sm: 52 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, minWidth: 0, flexShrink: 0 }}>
                        <Tooltip title="Menu">
                            <IconButton
                                onClick={() => setDrawerOpen(true)}
                                size="small"
                                sx={{
                                    color: '#d4a853',
                                    p: 0.75,
                                    '&:hover': {
                                        backgroundColor: 'rgba(212, 168, 83, 0.15)',
                                    }
                                }}
                            >
                                <MenuIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Button
                            component={Link}
                            to="/"
                            size="small"
                            onClick={() => onNavigate?.({ type: 'home' })}
                            sx={navButtonSx(location.pathname === '/' && currentView.type === 'home')}
                        >
                            Trade Calculator
                        </Button>
                        <Button
                            component={Link}
                            to="/binder"
                            size="small"
                            sx={navButtonSx(location.pathname === '/binder')}
                        >
                            My Binder
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.75,
                            flexGrow: 1,
                            minWidth: 0,
                            cursor: currentView.type !== 'home' || location.pathname !== '/'
                                ? 'pointer'
                                : 'default'
                        }}
                        onClick={() => {
                            if (location.pathname !== '/') {
                                navigate('/');
                            }
                            if (currentView.type !== 'home' && onNavigate) {
                                onNavigate({ type: 'home' });
                            }
                        }}
                    >
                        <Box
                            component="img"
                            src="/app_icon.png"
                            alt="RiftTrades"
                            sx={{
                                width: { xs: 24, sm: 28 },
                                height: { xs: 24, sm: 28 },
                                borderRadius: 1,
                                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.25)',
                                flexShrink: 0,
                            }}
                        />
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '1.1rem', sm: '1.35rem', md: '1.6rem' },
                                background: 'linear-gradient(135deg, #e5c078 0%, #d4a853 50%, #b8892e 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                letterSpacing: '0.02em',
                                lineHeight: 1.2,
                            }}
                        >
                            RiftTrades
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                        <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
                            <IconButton
                                onClick={toggleMode}
                                size="small"
                                sx={{
                                    color: '#d4a853',
                                    p: 0.75,
                                    '&:hover': {
                                        backgroundColor: 'rgba(212, 168, 83, 0.15)',
                                    }
                                }}
                            >
                                {isDark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                        <LoginButton />
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="footer"
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: (theme) => theme.zIndex.appBar,
                    py: 0.5,
                    px: 1.5,
                    textAlign: 'center',
                    borderTop: '1px solid',
                    borderColor: isDark ? 'rgba(212, 168, 83, 0.25)' : 'rgba(26, 90, 122, 0.2)',
                    background: isDark
                        ? 'rgba(6, 24, 37, 0.92)'
                        : 'rgba(232, 244, 248, 0.94)',
                    backdropFilter: 'blur(8px)',
                }}
            >
                <Typography
                    sx={{
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        color: isDark ? '#a0c4d4' : '#1a4a6e',
                        opacity: 0.9,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    Prices last updated: {lastUpdatedTimestamp ? formatTimestamp(lastUpdatedTimestamp) : 'Loading...'}
                </Typography>
            </Box>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: { xs: 280, sm: 320 },
                        background: isDark
                            ? 'linear-gradient(180deg, #0d3050 0%, #0a2540 100%)'
                            : 'linear-gradient(180deg, #ffffff 0%, #e8f4f8 100%)',
                        borderRight: `3px solid ${isDark ? '#d4a853' : '#1a5a7a'}`
                    }
                }}
            >
                <Box sx={{
                    px: 2.5,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, #0a2540 0%, #0d3050 50%, #1a4a6e 100%)',
                    borderBottom: '2px solid #d4a853'
                }}>
                    <Typography sx={{
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        background: 'linear-gradient(135deg, #e5c078 0%, #d4a853 50%, #b8892e 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Menu
                    </Typography>
                    <IconButton
                        onClick={() => setDrawerOpen(false)}
                        sx={{ color: '#d4a853', p: 0.5 }}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <List sx={{ py: 1 }}>
                    <ListItemButton
                        selected={location.pathname === '/' && currentView.type === 'home'}
                        onClick={() => handleNavigate({ type: 'home' })}
                        sx={{
                            mx: 1,
                            borderRadius: 2,
                            '&.Mui-selected': {
                                backgroundColor: isDark ? 'rgba(212, 168, 83, 0.15)' : 'rgba(26, 90, 122, 0.1)',
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: isDark ? '#d4a853' : '#1a5a7a', minWidth: 40 }}>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Trade Calculator"
                            primaryTypographyProps={{
                                fontWeight: 600,
                                color: isDark ? '#e8f4f8' : '#0a2540'
                            }}
                        />
                    </ListItemButton>

                    <ListItemButton
                        selected={location.pathname === '/binder'}
                        onClick={() => handleRoute('/binder')}
                        sx={{
                            mx: 1,
                            borderRadius: 2,
                            '&.Mui-selected': {
                                backgroundColor: isDark ? 'rgba(212, 168, 83, 0.15)' : 'rgba(26, 90, 122, 0.1)',
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: isDark ? '#d4a853' : '#1a5a7a', minWidth: 40 }}>
                            <BinderIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="My Binder"
                            primaryTypographyProps={{
                                fontWeight: 600,
                                color: isDark ? '#e8f4f8' : '#0a2540'
                            }}
                        />
                    </ListItemButton>

                    <ListItemButton
                        selected={location.pathname === '/wants'}
                        onClick={() => handleRoute('/wants')}
                        sx={{
                            mx: 1,
                            borderRadius: 2,
                            '&.Mui-selected': {
                                backgroundColor: isDark ? 'rgba(212, 168, 83, 0.15)' : 'rgba(26, 90, 122, 0.1)',
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: isDark ? '#d4a853' : '#1a5a7a', minWidth: 40 }}>
                            <WantIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Want List"
                            primaryTypographyProps={{
                                fontWeight: 600,
                                color: isDark ? '#e8f4f8' : '#0a2540'
                            }}
                        />
                    </ListItemButton>

                    <ListItemButton
                        selected={location.pathname === '/history'}
                        onClick={() => handleRoute('/history')}
                        sx={{
                            mx: 1,
                            borderRadius: 2,
                            '&.Mui-selected': {
                                backgroundColor: isDark ? 'rgba(212, 168, 83, 0.15)' : 'rgba(26, 90, 122, 0.1)',
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: isDark ? '#d4a853' : '#1a5a7a', minWidth: 40 }}>
                            <HistoryIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Trade History"
                            primaryTypographyProps={{
                                fontWeight: 600,
                                color: isDark ? '#e8f4f8' : '#0a2540'
                            }}
                        />
                    </ListItemButton>

                    <ListItemButton
                        onClick={() => handleRoute('/privacy')}
                        sx={{ mx: 1, borderRadius: 2 }}
                    >
                        <ListItemIcon sx={{ color: isDark ? '#d4a853' : '#1a5a7a', minWidth: 40 }}>
                            <PrivacyIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Privacy Policy"
                            primaryTypographyProps={{
                                fontWeight: 600,
                                color: isDark ? '#e8f4f8' : '#0a2540'
                            }}
                        />
                    </ListItemButton>
                </List>

                <Divider sx={{ mx: 2, borderColor: isDark ? 'rgba(212, 168, 83, 0.2)' : 'rgba(26, 90, 122, 0.15)' }} />

                <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
                    <Typography sx={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: isDark ? '#a0c4d4' : '#1a4a6e',
                        opacity: 0.8
                    }}>
                        Sets · Most Expensive
                    </Typography>
                </Box>

                <List sx={{ py: 0, overflow: 'auto' }}>
                    {sets.length === 0 && (
                        <Box sx={{ px: 2.5, py: 2 }}>
                            <Typography sx={{
                                fontSize: '0.85rem',
                                color: isDark ? '#a0c4d4' : '#1a4a6e',
                                opacity: 0.7,
                                fontStyle: 'italic'
                            }}>
                                Loading sets…
                            </Typography>
                        </Box>
                    )}
                    {sets.map((set) => {
                        const isActive = currentView.type === 'set' && currentView.setName === set.name;
                        return (
                            <ListItemButton
                                key={set.name}
                                selected={isActive}
                                onClick={() => handleNavigate({ type: 'set', setName: set.name })}
                                sx={{
                                    mx: 1,
                                    borderRadius: 2,
                                    mb: 0.25,
                                    '&.Mui-selected': {
                                        backgroundColor: isDark ? 'rgba(212, 168, 83, 0.15)' : 'rgba(26, 90, 122, 0.1)',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: isDark ? '#d4a853' : '#1a5a7a', minWidth: 40 }}>
                                    <SetIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={set.name}
                                    primaryTypographyProps={{
                                        fontWeight: 600,
                                        fontSize: '0.92rem',
                                        color: isDark ? '#e8f4f8' : '#0a2540'
                                    }}
                                />
                                <Chip
                                    label={set.count}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        color: isDark ? '#0a2540' : '#ffffff',
                                        backgroundColor: isDark ? '#d4a853' : '#1a5a7a',
                                        '& .MuiChip-label': { px: 1 }
                                    }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Drawer>
        </>
    );
};

export default Header;
