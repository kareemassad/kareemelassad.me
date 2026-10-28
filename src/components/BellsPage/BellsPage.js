import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BellCollection from '../BellCollection/BellCollection';
import './BellsPage.scss';

export default function BellsPage() {
  return (
    <div className="bells-page">
      <BellCollection />
    </div>
  );
}
