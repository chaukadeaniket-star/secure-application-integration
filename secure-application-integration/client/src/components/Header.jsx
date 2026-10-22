import { useRef, useState } from 'react';
import { Bell, ChevronDown, LogOut } from 'lucide-react';

export default function Header({ displayName, onLogout }) {
  const profileMenu = useRef(null);

  function logOut() {
    profileMenu.current?.removeAttribute('open');
    onLogout();
  }

  return (
    <header className="topbar">
      <div className="topbar-actions">
        <details className="topbar-menu notification-menu">
          <summary className="icon-button notification-button" aria-label="Notifications">
            <Bell size={19} /><i />
          </summary>
          <div className="topbar-popover notification-popover">
            <strong>Notifications</strong>
            <p>You're all caught up.</p>
          </div>
        </details>
        <details className="topbar-menu profile-menu" ref={profileMenu}>
          <summary className="profile-button">
            <span className="avatar">{displayName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span>
            <span className="profile-name">{displayName}</span>
            <ChevronDown size={15} />
          </summary>
          <div className="topbar-popover profile-popover">
            <span className="account-label">Signed in as</span>
            <strong>{displayName}</strong>
            <button className="account-action" onClick={logOut}>
              <LogOut size={16} /> Log out
            </button>
          </div>
        </details>
      </div>
    </header>
  );
}
