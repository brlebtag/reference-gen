import React, { Component } from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import update from 'immutability-helper';
import Form from 'react-bootstrap/Form';

function ajustarAcentuacao(str) {
  const acentos = {
      '\'a': 'á',
      '\'e': 'é',
      '\'i': 'í',
      '\'ı': 'í',
      '\'o': 'ó',
      '\'u': 'ú',
      
      '\'A': 'Á',
      '\'E': 'É',
      '\'I': 'Í',
      '\'İ': 'Í',
      '\'O': 'Ó',
      '\'U': 'Ú',

      '\´a': 'á',
      '\´e': 'é',
      '\´i': 'í',
      '\´ı': 'í',
      '\´o': 'ó',
      '\´u': 'ú',

      '\´A': 'Á',
      '\´E': 'É',
      '\´I': 'Í',
      '\´İ': 'Í',
      '\´O': 'Ó',
      '\´U': 'Ú',

      '\~a': 'ã',
      '\~e': 'ẽ',
      '\~i': 'ĩ',
      '\~ı': 'ĩ',
      '\~o': 'õ',
      '\~u': 'ũ',

      '\~A': 'Ã',
      '\~E': 'Ẽ',
      '\~I': 'Ĩ',
      '\~İ': 'Ĩ',
      '\~O': 'Õ',
      '\~U': 'Ũ',

      '\˜a': 'ã',
      '\˜e': 'ẽ',
      '\˜i': 'ĩ',
      '\˜ı': 'ĩ',
      '\˜o': 'õ',
      '\˜u': 'ũ',

      '\˜A': 'Ã',
      '\˜E': 'Ẽ',
      '\˜I': 'Ĩ',
      '\˜İ': 'Ĩ',
      '\˜O': 'Õ',
      '\˜U': 'Ũ',

      '\`a': 'à',
      '\`e': 'è',
      '\`i': 'ì',
      '\`ı': 'ì',
      '\`o': 'ò',
      '\`u': 'ù',

      '\`A': 'À',
      '\`E': 'È',
      '\`I': 'Ì',
      '\`İ': 'Ì',
      '\`O': 'Ò',
      '\`U': 'Ù',

      '\¨a': 'ä',
      '\¨e': 'ë',
      '\¨i': 'ï',
      '\¨ı': 'ï',
      '\¨o': 'ö',
      '\¨u': 'ü',

      '\¨A': 'Ä',
      '\¨E': 'Ë',
      '\¨I': 'Ï',
      '\¨İ': 'Ï',
      '\¨O': 'Ö',
      '\¨U': 'Ü',

      '\\^a': 'â',
      '\\^e': 'ê',
      '\\^i': 'î',
      '\\^ı': 'î',
      '\\^o': 'ô',
      '\\^u': 'û',

      '\\^A': 'Â',
      '\\^E': 'Ê',
      '\\^I': 'Î',
      '\\^İ': 'Î',
      '\\^O': 'Ô',
      '\\^U': 'Û',

      '\ˆa': 'â',
      '\ˆe': 'ê',
      '\ˆi': 'î',
      '\ˆı': 'î',
      '\ˆo': 'ô',
      '\ˆu': 'û',

      '\ˆA': 'Â',
      '\ˆE': 'Ê',
      '\ˆI': 'Î',
      '\ˆİ': 'Î',
      '\ˆO': 'Ô',
      '\ˆU': 'Û',

      '\´A': 'Á',
      '\´E': 'É',
      '\´I': 'Í',
      '\ˆİ': 'Í',
      '\´O': 'Ó',
      '\´U': 'Ú',
      
      '\¸c': 'ç',
      '\¸C': 'Ç',

      '↵': 'ff',
      '\\&': '\&\#038;',
      '\“': '\"',
      '\”': '\"',
      '\´s': '\'s',
      '\´S': '\'S',
  };

  for(var acento in acentos) {
      const valor = acentos[acento];
      str = str.replace(new RegExp(acento, 'g'), valor);
  }

  return str.replace(/\w- \w/g, (val) => {
      return val.replace('- ', '');
  });
}

function formatar(str) {
  return str.trim().split(/[ \n\t]/g).map(s => s.replace(/ /g, '')).join(' ');
}

function quebrarReferencias(text) {
  const referencias = [];
  let referencia = '';

  const len = text.length;

  debugger;

  for(let i = 0; i < len; i++) {
    let ch = text.charAt(i);

    if (ch == ']') {
      i++;
      for(; i < len; i++) {
        ch = text.charAt(i);
        if (ch == '[') {
          referencias.push(formatar(referencia));
          referencia = '';
          break;
        }
        referencia += ch;
      }
    }
  }

  if (referencia != '') {
    referencias.push(formatar(referencia));
  }

  return referencias;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artigos: [
        {
          id: '1º artigo',
          texto: '',
        }
      ]
    };

    this.adicionaArtigo = this.adicionaArtigo.bind(this);
    this.removeArtigo = this.removeArtigo.bind(this);
    this.gerarEBaixar = this.gerarEBaixar.bind(this);
  }

  gerarEBaixar() {
    const { artigos } = this.state;
    let csv = '';
    let i = 0;

    for(let artigo of artigos) {
      for(let referencia of quebrarReferencias(artigo.texto)) {
        csv += `${i+1}|${referencia}\n`;
      }      
      i++;
    }

    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'referencias.csv';
    hiddenElement.click();
  }

  onTextoChanged(i, e) {
    this.setState(update(this.state, {
      artigos: {
        [i]: {texto: {$set: e.target.value}},
      }
    }));
  }

  adicionaArtigo() {
    const len = this.state.artigos.length;

    this.setState(update(this.state, {
      artigos: {
        $push: [{
          id: `${len + 1}º artigo`,
          texto: '',
        }]
      }
    }));
  }

  removeArtigo() {
    const len = this.state.artigos.length;

    if (len <= 0) return;

    this.setState(update(this.state, {
      artigos: {
        $splice: [[len - 1, 1]],
      }
    }));
  }

  ajustar(i) {
    const { artigos } = this.state;

    this.setState(update(this.state, {
      artigos: {
        [i]: {texto: {$set: ajustarAcentuacao(artigos[i].texto)}},
      }
    }));
  }

  render() {
    const { artigos } = this.state;
    const navs = [];
    const tabs = [];
    let i = 0;

    for(let artigo of artigos) {
      navs.push(
        <Nav.Item>
          <Nav.Link eventKey={artigo.id}>{artigo.id}</Nav.Link>
        </Nav.Item>
      )

      tabs.push(
        <Tab.Pane eventKey={artigo.id}>
          <div className="float-right mb-2">
            <Button variant="light" title="Ajustar acentuação" onClick={this.ajustar.bind(this, i)}>
              <i class="fas fa-font"></i>
            </Button>
          </div>
          <Form.Control
            as="textarea"
            onChange={this.onTextoChanged.bind(this, i)}
            value={artigo.texto}
            rows="9"
          />
          
        </Tab.Pane>
      )
      
      i++;
    }

    return (
      <div className="App">
        <Container>
          <Row>
            <Col>
              <Button variant="success" title="Gerar e baixar CSV" onClick={this.gerarEBaixar}>
                <i class="fas fa-download"></i> Gerar & Baixar
              </Button>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <Tab.Container id="left-tabs-example" defaultActiveKey="1º artigo">
                <Row>
                  <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                      {navs}
                    </Nav>
                  </Col>
                  <Col sm={9}>
                    <Tab.Content>
                      {tabs}
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Button className="mr-2" variant="dark" title="Adicionar um artigo" onClick={this.adicionaArtigo}>
                <i class="fas fa-plus-circle"></i>
              </Button>
              <Button variant="warning" title="Remover um artigo" onClick={this.removeArtigo}>
                <i class="fas fa-minus-circle"></i>
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
