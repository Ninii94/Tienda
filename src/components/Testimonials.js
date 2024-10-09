import React from 'react';
import testimonialData from './testimonialData.json';
import './Testimonials.css';

const Testimonials = () => {
    return (
      <div className="testimonials-container">
        <h2 className= "clientes">Nuestros clientes</h2>
        <div className="testimonials-grid">
          {testimonialData.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="profile-image-container">
                <img
                  src={`/images/${testimonial.profileImage}`}
                  alt="Foto de perfil"
                  className="profile-image"
                />
              </div>
              <h3>{testimonial.name}</h3>
              <p>{testimonial.testimonial}</p>
              <div className="rating">
                {Array(Math.floor(Math.random() * 2) + 4)
                  .fill()
                  .map((_, i) => (
                    <span key={i} className="star">
                      &#9733;
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Testimonials;