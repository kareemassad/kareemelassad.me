import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import BellCollection from '../BellCollection/BellCollection';
import './BellsPage.scss';

export default function BellsPage() {
  return (
    <div className="bells-page">
      <div className="bells-page-back">
        <Link to="/">&larr; kareemelassad.me</Link>
      </div>
      <BellCollection />
    </div>
  );
}
