import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.scss';

const work = [
  {
    company: 'ScaleToWholesale.com',
    role: 'Founder',
    period: 'Nov 2025 – present',
    stack: 'TypeScript, Next.js, Stripe, Drizzle, PostgreSQL, Redis, QStash',
    link: 'https://www.scaletowholesale.com/',
  },
  {
    company: 'Array (Privacy Protect)',
    role: 'Web Scraping Engineer',
    period: 'Jan 2024 – Nov 2025',
    stack: 'TypeScript, RabbitMQ, CDP, Terraform, Prisma, Redis, AWS, PostgreSQL',
    link: 'https://array.com/products/privacy-protect',
  },
  {
    company: 'Nokia',
    role: 'Network Automation Intern',
    period: 'May – Dec 2023',
    stack: 'Python, APIs',
    link: 'https://www.nokia.com/',
  },
  {
    company: 'Blue Guardian',
    role: 'Software Engineer',
    period: 'Mar – May 2023',
    stack: 'TypeScript, MongoDB, RabbitMQ',
    link: 'https://www.nextcanada.com/blue-guardian/',
  },
  {
    company: 'Nokia',
    role: 'Data Engineering Intern',
    period: 'May – Aug 2022',
    stack: 'Python, SQL, Kafka, ClickHouse, Grafana',
    link: 'https://www.nokia.com/',
  },
  {
    company: 'Ciena',
    role: 'Software Engineering Intern',
    period: 'May – Aug 2021',
    stack: 'Python, Kafka, Cython',
    link: 'https://www.ciena.com/',
  },
  {
    company: 'Bell Canada',
    role: 'Software Developer Intern',
    period: 'Sep 2020 – Apr 2021',
    stack: 'Python, Kafka, Docker, FastAPI',
    link: 'https://www.bell.ca/',
  },
];

const projects = [
  {
    title: 'Autonomous Vehicle Real-time Object Detection',
    stack: 'Python, YOLOv7, Roboflow',
    link: null,
  },
  {
    title: 'Cryptocurrency Trading Bot \u2014 Acquired',
    stack: 'Python, Binance API',
    link: null,
  },
  {
    title: 'Sudoku.com Solver',
    stack: 'Python, Selenium',
    link: 'https://github.com/kareemassad/sudoku.com-solver-py',
  },
];

export default function MainPage() {
  return (
    <div className="main-page">
      <header className="mp-header">
        <h1>Kareem El Assad</h1>
        <p className="mp-subtitle">Software Engineer &middot; Ottawa, CA</p>
        <nav className="mp-links">
          <a href="mailto:kareemassad4@gmail.com">email</a>
          <span className="mp-sep">/</span>
          <a href="https://linkedin.com/in/KareemElA" target="_blank" rel="noreferrer">linkedin</a>
          <span className="mp-sep">/</span>
          <a href="https://github.com/kareemassad" target="_blank" rel="noreferrer">github</a>
        </nav>
      </header>

      <hr />

      <section>
        <h2 className="mp-section-label">Work</h2>
        {work.map((job) => (
          <div className="mp-job" key={job.company + job.period}>
            <div className="mp-job-top">
              <a className="mp-job-company" href={job.link} target="_blank" rel="noreferrer">{job.company}</a>
              <span className="mp-job-meta">{job.role} &middot; {job.period}</span>
            </div>
            <div className="mp-job-stack">{job.stack}</div>
          </div>
        ))}
      </section>

      <hr />

      <section>
        <h2 className="mp-section-label">Projects</h2>
        {projects.map((p) => (
          <div className="mp-project" key={p.title}>
            <span className="mp-project-title">
              {p.link
                ? <a href={p.link} target="_blank" rel="noreferrer">{p.title}</a>
                : p.title}
            </span>
            <span className="mp-project-stack"> &middot; {p.stack}</span>
          </div>
        ))}
      </section>

      <hr />

      <section>
        <h2 className="mp-section-label">Education</h2>
        <div className="mp-edu">
          <a href="https://carleton.ca" target="_blank" rel="noreferrer">Carleton University</a>
          <span className="mp-job-meta"> &mdash; B.Eng. Software Engineering &middot; 2018&ndash;2024</span>
        </div>
      </section>

      <hr />

      <div className="mp-bells-link">
        <Link to="/bells">&#x1F514; Teta&apos;s Bell Collection &rarr;</Link>
      </div>
    </div>
  );
}
