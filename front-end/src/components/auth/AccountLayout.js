import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/MeadowHome.css';
import './Account.css';

export default function AccountLayout({ mode, children }) {
  return <div className="meadow-site account-page">
    <a className="meadow-skip" href="#account-form">Skip to form</a>
    <header className="account-header">
      <Link to="/" className="meadow-wordmark" aria-label="WiNGHacks home">WiNGHacks</Link>
      <Link to="/" className="account-home">Home</Link>
    </header>
    <main className="account-main">
      <section className="account-paper" id="account-form" tabIndex={-1}
        aria-label={mode === 'signup' ? 'Sign up' : mode === 'reset' ? 'Reset your password' : 'Log in'}>
        {children}
      </section>
    </main>
    <footer className="account-footer">
      <a href="mailto:uf.winghacks.webmaster@gmail.com">Need help?</a>
    </footer>
  </div>;
}
