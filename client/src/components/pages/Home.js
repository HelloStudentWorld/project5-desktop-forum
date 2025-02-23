import React, { useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../features/categories/categoriesSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { status } = useSelector((state) => state.categories);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  return (
    <div className="home-container">
      <section className="welcome-section">
        <h1>Welcome to the Drive Vision Q&A Forum</h1>
        <p>
          Your go-to platform for asking questions about NVIDIA's autonomous driving technology—and getting well-researched, source-backed answers.
          Whether you're a student, hobbyist, or industry professional, this community helps you connect, learn, and collaborate on the latest advances in self-driving tech.
        </p>
        
        <div className="cta-container">
          {isAuthenticated ? (
            <Link to="/forum" className="cta-button">
              Go to Forum
            </Link>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="cta-button">
                Login
              </Link>
              <Link to="/register" className="cta-button">
                Register
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <h3>Ask a Question</h3>
            <p>Every post must be phrased as a clear question ending with a question mark (?), like "How do I integrate LiDAR with NVIDIA DRIVE Orin?"</p>
          </div>
          <div className="step-card">
            <h3>Get an In-Depth Answer</h3>
            <p>Other members (students, enthusiasts, or pros) respond with well-supported answers. We encourage citing official NVIDIA documentation, academic papers, or peer-reviewed articles in each reply.</p>
          </div>
          <div className="step-card">
            <h3>Use the Right Category</h3>
            <p>We've organized our forum by autonomous vehicle system (Perception, Localization, Planning, etc.). Pick the category that best fits your question.</p>
          </div>
          <div className="step-card">
            <h3>Keep It Credible & Helpful</h3>
            <p>Provide references to back up your insights—include relevant links (e.g., NVIDIA Developer Docs, IEEE Xplore, arXiv) or direct quotes. The community thrives on accurate, fact-based information.</p>
          </div>
          <div className="step-card">
            <h3>Collaborate & Learn</h3>
            <p>We're all here to expand our knowledge. Jump into discussions, correct misconceptions politely, and build on each other's expertise.</p>
          </div>
        </div>
      </section>

      <section className="why-ask-here">
        <h2>Why Ask Here?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>Focused on NVIDIA Autonomous Tech</h3>
            <p>We hone in on the DRIVE platform, Orin, Hyperion sensor setups, and more—no off-topic chatter.</p>
          </div>
          <div className="benefit-card">
            <h3>Expert & Peer Answers</h3>
            <p>Learn from others' experiences; share your own code snippets, success stories, or troubleshooting tips.</p>
          </div>
          <div className="benefit-card">
            <h3>Source-Based Discussions</h3>
            <p>Responses with references are encouraged, helping maintain scientific rigor and accuracy.</p>
          </div>
          <div className="benefit-card">
            <h3>Grow a Knowledge Base</h3>
            <p>Each question and answer helps build a searchable library of solutions for future visitors.</p>
          </div>
        </div>
      </section>

      <section className="getting-started">
        <h2>Getting Started</h2>
        <div className="steps-list">
          <div className="step-item">
            <h3>1. Register or Log In</h3>
            <p>Click the buttons above to create your account or sign in.</p>
          </div>
          <div className="step-item">
            <h3>2. Browse or Pick a Category</h3>
            <p>Glance at our topics: Perception & Sensor Fusion, Localization & Mapping, and more.</p>
          </div>
          <div className="step-item">
            <h3>3. Post a Question</h3>
            <p>Make sure your title ends with a ? and add details or background in the body.</p>
          </div>
          <div className="step-item">
            <h3>4. Check for Answers & Engage</h3>
            <p>Thank respondents, ask for clarifications, and upvote particularly well-researched replies.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;