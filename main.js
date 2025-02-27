// ==UserScript==
// @name        Canvas UBC UI Enhancement (Sidebar Integration)
// @namespace   https://canvas.ubc.ca/
// @match       https://canvas.ubc.ca/*
// @grant       none
// @version     2.2
// @author      -
// @description Sleek UI enhancements for Canvas UBC with dark mode toggle in sidebar menu
// ==/UserScript==

(function () {
  'use strict';

  // UI Framework Object
  const CanvasUI = {
    init() {
      console.log('Canvas UI Framework Initialized - Sidebar Integration');
      this.setupStyles();
      this.setupSidebarMenu();
      this.setupKeyboardShortcuts();
    },

    setupStyles() {
      const style = document.createElement('style');
      style.textContent = `
        /* CSS Variables for theming */
        :root {
          --primary-color: #0075db;
          --primary-hover: #005ea8;
          --dark-bg-color: #1a1a1a;
          --dark-secondary-bg: #2d2d2d;
          --dark-text-color: #e0e0e0;
          --dark-border-color: #444;
          --light-bg-color: #ffffff;
          --light-secondary-bg: #f5f5f5;
          --light-text-color: #333;
          --light-border-color: #ddd;
          --transition-speed: 0.3s;
        }

        /* Dark Mode Styles */
        body.ubc-dark-mode {
          background-color: var(--dark-bg-color) !important;
          color: var(--dark-text-color) !important;
        }

        body.ubc-dark-mode #application,
        body.ubc-dark-mode #main,
        body.ubc-dark-mode .ic-app-main-content,
        body.ubc-dark-mode .ic-Layout-wrapper,
        body.ubc-dark-mode .ic-Layout-columns,
        body.ubc-dark-mode .ic-Layout-contentMain {
          background-color: var(--dark-bg-color) !important;
          color: var(--dark-text-color) !important;
        }

        body.ubc-dark-mode .ic-Dashboard-header__layout,
        body.ubc-dark-mode .ic-DashboardCard,
        body.ubc-dark-mode .ic-DashboardCard__header,
        body.ubc-dark-mode .ic-DashboardCard__header-button {
          background-color: var(--dark-secondary-bg) !important;
          color: var(--dark-text-color) !important;
          border-color: var(--dark-border-color) !important;
        }

        body.ubc-dark-mode h3.ic-DashboardCard__header-title,
        body.ubc-dark-mode .ic-DashboardCard__header-title {
          background-color: transparent !important;
          color: var(--dark-text-color) !important;
        }

        body.ubc-dark-mode a:not(.btn),
        body.ubc-dark-mode a.btn-link {
          color: #64b5f6 !important;
        }

        body.ubc-dark-mode table,
        body.ubc-dark-mode th,
        body.ubc-dark-mode td {
          border-color: var(--dark-border-color) !important;
          background-color: var(--dark-secondary-bg) !important;
          color: var(--dark-text-color) !important;
        }

        /* Sidebar Button */
        .ubc-sidebar-button {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 12px;
          margin-bottom: 12px;
          cursor: pointer;
          color: #fff;
          text-decoration: none;
          transition: background-color var(--transition-speed);
        }

        .ubc-sidebar-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .ubc-sidebar-button-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #0C2340;
          border: 2px solid white;
          margin-bottom: 8px;
          font-size: 20px;
        }

        .ubc-sidebar-button-text {
          text-align: center;
          font-size: 14px;
          line-height: 1.3;
        }

        /* Hidden Menu */
        .ubc-hidden-menu {
          position: fixed;
          background: rgba(33, 33, 33, 0.95);
          color: white;
          padding: 10px 0;
          border-radius: 12px;
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
          z-index: 9999;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          min-width: 220px;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .ubc-hidden-menu.visible {
          opacity: 1;
          pointer-events: auto;
        }

        .ubc-hidden-menu ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .ubc-hidden-menu li {
          padding: 12px 18px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 2px 5px;
          border-radius: 8px;
        }

        .ubc-hidden-menu li:hover {
          background: rgba(255,255,255,0.12);
          transform: translateX(3px);
        }

        .ubc-hidden-menu li.active {
          background-color: rgba(0, 117, 219, 0.2);
        }

        .ubc-hidden-menu li i {
          margin-right: 10px;
          width: 16px;
          text-align: center;
        }

        /* Mode Toggle */
        .mode-toggle-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mode-toggle {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 20px;
        }

        .mode-toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .mode-toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }

        .mode-toggle-slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .mode-toggle-slider {
          background-color: var(--primary-color);
        }

        input:checked + .mode-toggle-slider:before {
          transform: translateX(20px);
        }

        /* Menu Item Animation */
        .ubc-hidden-menu.visible li {
          animation: fadeIn 0.3s forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .ubc-hidden-menu.visible li:nth-child(1) { animation-delay: 0.05s; }
        .ubc-hidden-menu.visible li:nth-child(2) { animation-delay: 0.1s; }
        .ubc-hidden-menu.visible li:nth-child(3) { animation-delay: 0.15s; }
        .ubc-hidden-menu.visible li:nth-child(4) { animation-delay: 0.2s; }
        .ubc-hidden-menu.visible li:nth-child(5) { animation-delay: 0.25s; }
        .ubc-hidden-menu.visible li:nth-child(6) { animation-delay: 0.3s; }
        .ubc-hidden-menu.visible li:nth-child(7) { animation-delay: 0.35s; }

        /* Notification Badge */
        .menu-notification {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: var(--primary-color);
          color: white;
          border-radius: 10px;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          font-size: 11px;
          margin-left: 8px;
        }

        /* Divider */
        .menu-divider {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 4px 0;
        }
      `;
      document.head.appendChild(style);
    },

    setupSidebarMenu() {
      // Load dark mode preference
      const darkModeEnabled = localStorage.getItem('ubc-dark-mode') === 'true';
      if (darkModeEnabled) {
        document.body.classList.add('ubc-dark-mode');
      }

      // Locate sidebar
      const sidebar = document.querySelector('div.ic-app-header__main-navigation');
      if (!sidebar) {
        console.error('Canvas UBC UI Enhancement: Could not find sidebar element');
        return;
      }

      // Create sidebar button
      const buttonWrapper = document.createElement('div');
      buttonWrapper.className = 'ubc-sidebar-button';
      buttonWrapper.title = 'UBC Tools';
      buttonWrapper.innerHTML = `
        <div class="ubc-sidebar-button-icon">⚙️</div>
        <div class="ubc-sidebar-button-text">UBC Tools</div>
      `;

      // Create menu
      const menu = document.createElement('div');
      menu.className = 'ubc-hidden-menu';
      menu.innerHTML = `
        <ul>
          <li class="mode-toggle-wrapper">
            <span><i>🌓</i> Dark Mode</span>
            <label class="mode-toggle">
              <input type="checkbox" id="dark-mode-checkbox" ${darkModeEnabled ? 'checked' : ''}>
              <span class="mode-toggle-slider"></span>
            </label>
          </li>
          <div class="menu-divider"></div>
          <li id="ubc-menu-dashboard" role="button" aria-label="Go to Dashboard"><i>📊</i> Dashboard <span class="menu-notification">3</span></li>
          <li id="ubc-menu-courses" role="button" aria-label="Go to Courses"><i>📚</i> Courses</li>
          <li id="ubc-menu-calendar" role="button" aria-label="Go to Calendar"><i>📅</i> Calendar <span class="menu-notification">1</span></li>
          <li id="ubc-menu-inbox" role="button" aria-label="Go to Inbox"><i>📬</i> Inbox</li>
          <li id="ubc-menu-grades" role="button" aria-label="Go to Grades"><i>📝</i> Grades</li>
          <div class="menu-divider"></div>
          <li id="ubc-menu-workday" role="button" aria-label="Open Workday"><i>💼</i> Workday</li>
        </ul>
      `;

      // Append elements
      sidebar.appendChild(buttonWrapper);
      document.body.appendChild(menu);

      // Position menu dynamically
      const updateMenuPosition = () => {
        const sidebarRect = sidebar.getBoundingClientRect();
        const buttonRect = buttonWrapper.getBoundingClientRect();
        const menuHeight = menu.offsetHeight;
        let topPosition = buttonRect.top + buttonRect.height / 2 - menuHeight / 2;

        // Keep menu within viewport
        if (topPosition < 0) {
          topPosition = 0;
        } else if (topPosition + menuHeight > window.innerHeight) {
          topPosition = window.innerHeight - menuHeight;
        }

        menu.style.left = `${sidebarRect.width}px`;
        menu.style.top = `${topPosition}px`;
      };

      updateMenuPosition();
      window.addEventListener('resize', updateMenuPosition);

      // Hover and click interactions
      let hoverTimeout;

      buttonWrapper.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          updateMenuPosition();
          menu.classList.add('visible');
        }, 100);
      });

      buttonWrapper.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          if (!menu.matches(':hover')) {
            menu.classList.remove('visible');
          }
        }, 300);
      });

      menu.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
      });

      menu.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          if (!buttonWrapper.matches(':hover')) {
            menu.classList.remove('visible');
          }
        }, 100);
      });

      buttonWrapper.addEventListener('click', () => {
        updateMenuPosition();
        menu.classList.toggle('visible');
      });

      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !buttonWrapper.contains(e.target)) {
          menu.classList.remove('visible');
        }
      });

      // Dark mode toggle
      const darkModeCheckbox = document.getElementById('dark-mode-checkbox');
      if (darkModeCheckbox) {
        darkModeCheckbox.addEventListener('change', () => {
          const isDarkMode = darkModeCheckbox.checked;
          document.body.classList.toggle('ubc-dark-mode', isDarkMode);
          localStorage.setItem('ubc-dark-mode', isDarkMode);
        });
      }

      // Menu item actions
      document.getElementById('ubc-menu-dashboard').addEventListener('click', () => {
        window.location.href = '/';
      });

      document.getElementById('ubc-menu-courses').addEventListener('click', () => {
        window.location.href = '/courses';
      });

      document.getElementById('ubc-menu-calendar').addEventListener('click', () => {
        window.location.href = '/calendar';
      });

      document.getElementById('ubc-menu-inbox').addEventListener('click', () => {
        window.location.href = '/conversations';
      });

      document.getElementById('ubc-menu-grades').addEventListener('click', () => {
        window.location.href = '/grades';
      });

      document.getElementById('ubc-menu-workday').addEventListener('click', () => {
        window.open('https://myworkday.ubc.ca/', '_blank');
      });
    },

    setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          return;
        }

        if (e.altKey && e.key === 'd') {
          const darkModeCheckbox = document.getElementById('dark-mode-checkbox');
          if (darkModeCheckbox) {
            darkModeCheckbox.checked = !darkModeCheckbox.checked;
            darkModeCheckbox.dispatchEvent(new Event('change'));
          }
        }

        if (e.altKey && e.key === 'm') {
          const menu = document.querySelector('.ubc-hidden-menu');
          if (menu) menu.classList.toggle('visible');
        }

        if (e.altKey) {
          switch (e.key) {
            case 'h': window.location.href = '/'; break;
            case 'c': window.location.href = '/courses'; break;
            case 'a': window.location.href = '/calendar'; break;
            case 'i': window.location.href = '/conversations'; break;
            case 'g': window.location.href = '/grades'; break;
            case 'w': window.open('https://myworkday.ubc.ca/', '_blank'); break;
          }
        }
      });
    }
  };

  // Initialize when page is ready
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => CanvasUI.init());
  } else {
    CanvasUI.init();
  }
})();