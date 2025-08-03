import React, { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { HiOutlineBars3 } from 'react-icons/hi2'
import { IoIosMoon, IoMdSunny } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'

const Navbar = () => {
  const [showNav, setShowNav] = useState(false)
  const [darkTheme, setDarkTheme] = useState(localStorage.getItem('voting-app-theme') || '')

  const token=useSelector(state=>state?.vote?.currentVoter?.token)
  // Close nav menu when a link is clicked (on mobile only)
  const closeNavMenu = () => {
    if (window.innerWidth < 600) {
      setShowNav(false)
    }
  }

  // Toggle light/dark theme
  const changeThemeHandler = () => {
    if (localStorage.getItem('voting-app-theme') === 'dark') {
      localStorage.setItem('voting-app-theme', '')
    } else {
      localStorage.setItem('voting-app-theme', 'dark')
    }
    setDarkTheme(localStorage.getItem('voting-app-theme'))
  }

  // Apply theme on change
  useEffect(() => {
    document.body.className = localStorage.getItem('voting-app-theme')
  }, [darkTheme])

  // Automatically hide nav on resize (optional enhancement)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 600) {
        setShowNav(true)
      } else {
        setShowNav(false)
      }
    }

    handleResize() // Set initial value based on screen size
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <nav>
      <div className="container nav_container">
        <Link to="/" className="nav_logo">E-Vote</Link>
        <div>
          { token &&  showNav && (
            <menu>
              <NavLink to="/elections" onClick={closeNavMenu}>Elections</NavLink>
              <NavLink to="/results" onClick={closeNavMenu}>Results</NavLink>
              <NavLink to="/logout" onClick={closeNavMenu}>Logout</NavLink>
            </menu>
          )}
          <button className="theme_toggle-btn" onClick={changeThemeHandler}>
            {darkTheme ? <IoMdSunny /> : <IoIosMoon />}
          </button>
          <button className="nav_toggle-btn" onClick={() => setShowNav(prev => !prev)}>
            {showNav ? <AiOutlineClose /> : <HiOutlineBars3 />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
