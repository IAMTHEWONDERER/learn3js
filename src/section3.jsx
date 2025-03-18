import React from 'react';

const Section3 = () => {
  return (
    <div className="section3-container">
      <div className="section3-content">
        <h2>NOTRE APPROCHE ÉCLAIRÉE</h2>
        <p>
          Dans un monde en constante évolution, notre vision se reflète dans une recherche continue d'équilibre entre innovation technologique et bien-être collectif. Nous visons à créer un environnement où l'innovation devient un synonyme de partage et de croissance commune.
        </p>
        <p>
          En rassemblant des talents divers et en encourageant des interactions constructives, nous œuvrons pour un avenir où chaque initiative contribue à un impact positif et durable.
        </p>
      </div>

      <style jsx>{`
        .section3-container {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background to ensure text visibility */
          position: relative;
          z-index: 10;
        }
        .section3-content {
          max-width: 800px;
          text-align: center;
          color: white;
          padding: 2rem;
          background-color: rgba(0, 0, 0, 0.6); /* Add background to text container */
          border-radius: 8px;
        }
        h2 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
        }
        p {
          font-size: 1.2rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Section3;