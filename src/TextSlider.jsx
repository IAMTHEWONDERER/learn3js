import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    text-align: center;
    background: linear-gradient(145deg, #ffffff, #f5f5f5);
    border-radius: 15px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.5px;
`;

const Content = styled.p`
    font-size: 1.1rem;
    line-height: 1.8;
    color: #34495e;
    margin-bottom: 1.5rem;
    text-align: justify;
`;

const TextSlider = () => {
    return (
        <Container>
            <Title>Welcome to Our Story</Title>
            <Content>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate 
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id 
                est laborum.
            </Content>
        </Container>
    );
};

export default TextSlider;