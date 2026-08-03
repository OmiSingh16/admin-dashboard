'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsPage() {
  // ✅ Try-catch for safety - yahi se warning aa rahi thi
  let sidebarTheme, updateTheme;
  try {
    const themeContext = useTheme();
    sidebarTheme = themeContext.sidebarTheme;
    updateTheme = themeContext.updateTheme;
  } catch (error) {
    console.warn('⚠️ Theme context not available, using fallback');
    // Fallback theme
    sidebarTheme = {
      background: 'rgba(15, 25, 45, 0.96)',
      textColor: '#bac4d3',
      activeBg: 'rgba(255, 255, 255, 0.12)',
      activeColor: 'white',
      hoverBg: 'rgba(255, 255, 255, 0.08)',
      iconColor: '#d3d6de',
      underlineColor: '#94a3b8'
    };
    updateTheme = () => {}; // Empty function as fallback
  }

  const [profileImage, setProfileImage] = useState('/default-avatar.jpeg');
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Theme presets
  const themes = {
    dark: {
      background: 'rgba(15, 25, 45, 0.96)',
      textColor: '#bac4d3',
      activeBg: 'rgba(255, 255, 255, 0.12)',
      activeColor: 'white',
      hoverBg: 'rgba(255, 255, 255, 0.08)',
      iconColor: '#d3d6de',
      underlineColor: '#94a3b8'
    },
    light: {
      background: 'rgba(224, 240, 227, 0.98)',
      textColor: '#16191d',
      activeBg: 'rgba(18, 71, 157, 0.1)',
      activeColor: '#3b82f6',
      hoverBg: 'rgba(0, 0, 0, 0.05)',
      iconColor: '#94a3b8',
      underlineColor: '#3b82f6'
    },
    blue: {
      background: 'rgba(30, 58, 138, 0.95)',
      textColor: '#93c5fd',
      activeBg: 'rgba(255, 255, 255, 0.15)',
      activeColor: 'white',
      hoverBg: 'rgba(255, 255, 255, 0.08)',
      iconColor: '#93c5fd',
      underlineColor: '#60a5fa'
    },
    green: {
      background: 'rgba(6, 78, 59, 0.95)',
      textColor: '#6ee7b7',
      activeBg: 'rgba(255, 255, 255, 0.15)',
      activeColor: 'white',
      hoverBg: 'rgba(255, 255, 255, 0.08)',
      iconColor: '#6ee7b7',
      underlineColor: '#34d399'
    },
    purple: {
      background: 'rgba(76, 29, 149, 0.95)',
      textColor: '#c4b5fd',
      activeBg: 'rgba(255, 255, 255, 0.15)',
      activeColor: 'white',
      hoverBg: 'rgba(255, 255, 255, 0.08)',
      iconColor: '#c4b5fd',
      underlineColor: '#8b5cf6'
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        localStorage.setItem('profileImage', imageData);
        setShowPopup(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage('/default-avatar.jpeg');
    localStorage.removeItem('profileImage');
    setShowPopup(false);
  };

  const handleThemeChange = (themeName) => {
    if (updateTheme) {
      updateTheme(themes[themeName]);
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="page-header">
        <h1>Settings</h1>
      </div>
      
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        border: '1px solid #eef3fc',
        marginTop: '24px'
      }}>
        {/* Profile Picture */}
        <div style={{ marginBottom: '40px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '20px'
          }}>
            Profile Picture
          </h4>
          
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div 
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '3px solid #eef3fc',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'inline-block'
              }}
              onClick={() => setShowPopup(!showPopup)}
            >
              <img 
                src={profileImage} 
                alt="Profile"
                suppressHydrationWarning
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = '/default-avatar.jpeg';
                }}
              />
            </div>
            
            {showPopup && (
              <div style={{
                position: 'absolute',
                top: '110px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                padding: '8px',
                minWidth: '180px',
                zIndex: 1000,
                border: '1px solid #eef3fc'
              }}>
                <button
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'transparent',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#1e293b',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <i className="fas fa-upload" style={{ color: '#3b82f6', width: '16px' }}></i>
                  Upload New
                </button>
                
                <button
                  onClick={handleRemoveImage}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'transparent',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#dc2626',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <i className="fas fa-trash-alt" style={{ width: '16px' }}></i>
                  Remove
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
          
          <p style={{ 
            fontSize: '13px', 
            color: '#94a3b8', 
            marginTop: '12px' 
          }}>
            Click image to change
          </p>
        </div>

        <div style={{ 
          height: '1px', 
          background: '#eef3fc',
          marginBottom: '30px'
        }}></div>

        {/* Theme Selection */}
        <div style={{ marginBottom: '40px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '16px'
          }}>
            Sidebar Theme
          </h4>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {Object.keys(themes).map((themeName) => (
              <button
                key={themeName}
                onClick={() => handleThemeChange(themeName)}
                style={{
                  padding: '10px 20px',
                  border: JSON.stringify(sidebarTheme) === JSON.stringify(themes[themeName]) ? '2px solid #3b82f6' : '2px solid #eef3fc',
                  borderRadius: '12px',
                  background: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  minWidth: '80px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: themes[themeName].background,
                  border: '1px solid #eef3fc'
                }}></div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#64748b',
                  textTransform: 'capitalize'
                }}>
                  {themeName}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ 
          height: '1px', 
          background: '#eef3fc',
          marginBottom: '30px'
        }}></div>

        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-sliders-h" style={{ 
            fontSize: '48px', 
            color: '#cbd5e1', 
            marginBottom: '16px' 
          }}></i>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#64748b', 
            marginBottom: '10px' 
          }}>
            More Settings
          </h3>
          <p style={{ color: '#94a3b8' }}>
            Additional settings coming soon...
          </p>
        </div>
      </div>
    </>
  );
}