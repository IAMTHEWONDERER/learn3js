import React from 'react';

const Section2 = () => {
  return (
    <div className="s2_xk72q_container">
      <div className="s2_m34pz_wrapper">
        <h1 className="s2_h91jx_title">NOTRE ESSENCE</h1>
        <div className="s2_t56ls_separator"></div>
        
        <div className="s2_c78tr_content">
          <p className="s2_p62df_paragraph">
            <span className="s2_b41oa_brand">Techniq8</span> est <span className="s2_e37yz_emphasis">votre partenaire de choix</span> dans le secteur numérique, un cabinet de consulting qui combine une expertise technologique de pointe et les meilleurs talents en ingénierie numérique pour dynamiser votre transformation digitale et stimuler l'innovation.
          </p>
          
          <p className="s2_p62df_paragraph">
            Nous vous accompagnons à chaque étape de votre parcours, en établissant <span className="s2_e37yz_emphasis">l'infrastructure technologique</span> nécessaire et en mobilisant les compétences pour préparer votre organisation aux défis futurs.
          </p>
          
          <div className="s2_d95mq_dot"></div>
          
          <p className="s2_p62df_paragraph">
            Chez Techniq8 nous allions innovations technologiques et valeurs humaines, pour développer des solutions sur mesure qui transforment les interactions et créent une réelle <span className="s2_e37yz_emphasis">valeur ajoutée</span>.
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .s2_xk72q_container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          width: 100%;
          padding: 2rem;
          box-sizing: border-box;
          background-color: rgba(255, 255, 255, 0.9);
          font-family: 'Arial', sans-serif;
        }
        
        .s2_m34pz_wrapper {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .s2_h91jx_title {
          color: #0b3b59;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: bold;
          margin-bottom: 1rem;
          letter-spacing: 1px;
        }
        
        .s2_t56ls_separator {
          height: 4px;
          width: 100%;
          background-color: #18b7be;
          margin-bottom: 2.5rem;
        }
        
        .s2_c78tr_content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .s2_p62df_paragraph {
          font-size: clamp(1rem, 1.2vw, 1.2rem);
          line-height: 1.6;
          color: #333;
          margin: 0;
        }
        
        .s2_b41oa_brand {
          font-weight: bold;
        }
        
        .s2_e37yz_emphasis {
          font-weight: bold;
          color: #0b3b59;
        }
        
        .s2_d95mq_dot {
          height: 8px;
          width: 8px;
          background-color: #18b7be;
          border-radius: 50%;
          margin: 0.5rem auto;
        }
        
        @media (max-width: 768px) {
          .s2_xk72q_container {
            padding: 1.5rem;
            text-align: left;
          }
          
          .s2_m34pz_wrapper {
            padding: 1rem;
          }
          
          .s2_t56ls_separator {
            margin-bottom: 1.5rem;
          }
          
          .s2_c78tr_content {
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Section2;