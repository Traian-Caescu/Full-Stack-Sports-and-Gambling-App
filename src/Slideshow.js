import React, { useState, useEffect } from 'react';
import './Slideshow.css';

const Slideshow = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); 

        return () => clearInterval(intervalId);
    }, [images.length]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="slideshow">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`slide ${index === currentIndex ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${image})` }}
                />
            ))}
            <div className="slideshow-indicators">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slideshow;
