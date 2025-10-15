import { useState } from "react";
import { Carousel, Container, Row, Col } from "react-bootstrap";
import { catalogo as productos } from "../../data/catalogo";
import '../../assets/style/principal/principal-base-style.css';
import '../../assets/style/principal/principal-carrusel-style.css';

export default function Carrusel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <section className="py-5" id="catalogo">
      <Container fluid className="catalogo-container">
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h2 className="display-5 fw-bold text-success mb-3">Nuestro Catálogo</h2>
            <p className="lead text-muted">
              Productos Frescos y Alimentos Orgánicos
            </p>
          </Col>
        </Row>
        
        <Carousel 
          className="carrusel-ancho"
          activeIndex={index} 
          onSelect={handleSelect}
          interval={3000}
          indicators={true}
          controls={true}
          fade={true}
        >
          {productos.map((prod, i) => (
            <Carousel.Item key={i}>
              <img
                className="d-block w-100"
                src={prod.imagen}
                alt={prod.titulo}
                style={{
                  width: '10%',
                  height: '1000px',
                  objectFit: 'cover',
                  objectPosition: 'center 50%',
                  borderRadius: '10px',
                  padding: '10px'
                }}
              />
              <Carousel.Caption>
                <h3>{prod.titulo}</h3>
                <p>{prod.descripcion}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}