import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link as RouterLink } from 'react-router-dom';

function Header(props) {
  const { sections, title } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedResources, setSelectedResources] = useState([]);
  const [subscribedResources, setSubscribedResources] = useState([]);
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const isLoggedIn = userData && userData.username;
  const [isSubscribedMode, setIsSubscribedMode] = useState(false); // Flag for subscribed mode

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        setLocation(`${data.city}, ${data.region}, ${data.country}`);
      })
      .catch(error => {
        console.error('Error fetching location:', error);
      });
  }, []);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        return response.json();
      })
      .then(data => {
        const { latitude, longitude } = data;
        const apiKey = 'd70769a308cc5c5c76e2f473dc7f4977';
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

        fetch(weatherUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch weather data');
            }
            return response.json();
          })
          .then(weatherData => {
            setWeatherData(weatherData);
          })
          .catch(error => {
            setError('Failed to fetch weather data');
            console.error('Error fetching weather data:', error);
          });
      })
      .catch(error => {
        setError('Failed to fetch location data');
        console.error('Error fetching location data:', error);
      });
  }, []);

  const handleSubscribeClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleResourceChange = event => {
    const resourceName = event.target.name;
    if (event.target.checked) {
      setSelectedResources([...selectedResources, resourceName]);
    } else {
      setSelectedResources(selectedResources.filter(res => res !== resourceName));
    }
  };

  const handleSubscribe = () => {
    setSubscribedResources(selectedResources);
    setSelectedResources([]);
    setOpenDialog(false);
  };

  const handleUnsubscribe = resource => {
    setSubscribedResources(subscribedResources.filter(res => res !== resource));
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    window.location.reload(); // Refresh page to reflect logout
  };

  const toggleSubscribedMode = () => {
    setIsSubscribedMode(!isSubscribedMode);
  };

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Button size="small" onClick={handleSubscribeClick}>
          {isSubscribedMode ? 'Subscribed' : 'Subscribe'}
        </Button>
        <Typography variant="body2" color="inherit" sx={{ mr: 2 }}>
          {location || 'Fetching location...'}
        </Typography>
        <Typography variant="body2" color="inherit" sx={{ mr: 2 }}>
          {weatherData
            ? `Weather: ${
                weatherData.weather[0].description.charAt(0).toUpperCase() +
                weatherData.weather[0].description.slice(1)
              }, ${weatherData.main.temp.toFixed()}°C`
            : 'Fetching weather...'}
        </Typography>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>

        <IconButton>
          <SearchIcon />
        </IconButton>
        {isLoggedIn ? (
          <React.Fragment>
            <Typography variant="body1" color="inherit" sx={{ mr: 2 }}>
              {userData.username}
            </Typography>
            <Button variant="outlined" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </React.Fragment>
        ) : (
          <Button variant="outlined" size="small" component={RouterLink} to="/signup">
            Sign up
          </Button>
        )}
      </Toolbar>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Select Resources to Subscribe</DialogTitle>
        <DialogContent>
          {sections.map((section, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedResources.includes(section.title)}
                  onChange={handleResourceChange}
                  name={section.title}
                />
              }
              label={section.title}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubscribe} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>

      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
      >
        {isSubscribedMode
          ? subscribedResources.map(resource => (
              <Button key={resource} onClick={() => handleUnsubscribe(resource)}>
                {resource} (Subscribed)
              </Button>
            ))
          : sections.map(section => (
              <Link
                color="inherit"
                noWrap
                key={section.title}
                variant="body2"
                href={section.url}
                sx={{ p: 1, flexShrink: 0 }}
              >
                {section.title}
              </Link>
            ))}
        <Button onClick={toggleSubscribedMode}>
          {isSubscribedMode ? 'Show All' : 'Show Subscribed'}
        </Button>
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;
