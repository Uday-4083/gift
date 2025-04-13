import React from 'react'
import styled from 'styled-components'
import { theme } from '../styles/theme'

const StyledFooter = styled.footer`
  background-color: ${theme.colors.background};
  padding: 0.75rem 0;
  border-top: 1px solid ${theme.colors.primary}22;
  margin-top: 2rem;
  text-align: center;

  p {
    font-family: ${theme.fonts.secondary};
    color: ${theme.colors.lightText};
    margin: 0;
    font-size: 0.85rem;

    a {
      color: ${theme.colors.primary};
      text-decoration: none;
      transition: ${theme.transitions.default};
      font-weight: 500;

      &:hover {
        color: ${theme.colors.secondary};
      }
    }
  }
`

const Footer = () => {
  return (
    <StyledFooter>
      <p>
        Made with ❤️ by{' '}
        <a 
          href="https://github.com/udaykumargurrapu" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Uday Kumar Gurrapu
        </a>
      </p>
    </StyledFooter>
  )
}

export default Footer 