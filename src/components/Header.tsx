import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'

export const Header = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container className='d-flex justify-content-around'>
        <Navbar.Brand style={{cursor:'default'}}><b>Team Exemplary</b></Navbar.Brand>
        <Navbar.Brand style={{cursor:'default'}}><b>Nagarro Got Talent</b>{' '}<small>ep: 3</small></Navbar.Brand>
      </Container>
    </Navbar>
  )
}
