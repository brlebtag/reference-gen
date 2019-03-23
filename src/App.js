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
import cheerio from 'cheerio';
import { DateTime } from 'luxon';

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
      // '\\&': '\&\#038;',
      '\“': '\"',
      '\”': '\"',
      '\´s': '\'s',
      '\´S': '\'S',

      'ˇC': 'Č',
      'ˇc': 'č',
      'ˇS': 'Š',
      'ˇs': 'š',
      'ˇz': 'Ž',
      'ˇz': 'ž',
      'ˇG': 'Ğ',
      'ˇg': 'ğ',
      '˘A': 'Ă',
      '˘a': 'ă',
      '˝u': 'ű',
      '˝U': 'Ű',
      '˝o': 'ű',
      '˝O': 'ő',
      '¨y': 'ÿ',
      '¨Y': 'Ÿ',
      '´n': 'ń',
      '´N': 'Ń',
      '`n': 'ǹ',
      '`N': 'Ǹ',
      '~n': 'ñ',
      '~N': 'Ñ',
      '˜n': 'ñ',
      '˜N': 'Ñ',
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
  let curNum = '';

  const len = text.length;

  for(let i = 0; i < len; i++) {
    let ch = text.charAt(i);

    if (ch == '[') {
      i++;
      for(; i < len; i++) {
        ch = text.charAt(i);
        if (ch == ']') {
          if (isNaN(curNum)) {
            referencia += `[${curNum}]`;
          }
          curNum = '';
          i++;
          break;
        }
        curNum += ch;
      }

      for(; i < len; i++) {
        ch = text.charAt(i);

        if (ch == '[') {
          referencias.push(formatar(referencia));
          referencia = '';
          i--;
          break;
        }
        referencia += ch;
      }
      continue;
    }

    for(; i < len && text.charAt(i) == '\n'; i++);

    for(; i < len; i++) {
      ch = text.charAt(i);

      if (ch == '[') {
        referencias.push(formatar(referencia));
        referencia = '';
        i--;
        break;
      }
      referencia += ch;
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
      artigos: [],
    };

    this.adicionaArtigo = this.adicionaArtigo.bind(this);
    this.removeArtigo = this.removeArtigo.bind(this);
    this.gerarEBaixar = this.gerarEBaixar.bind(this);
    this.onFileChanged = this.onFileChanged.bind(this);
    this.onCarregarCSV = this.onCarregarCSV.bind(this);
    this.limpar = this.limpar.bind(this);
    this.xml = [];
  }

  componentDidMount() {
    let artigos;

    try {
      artigos = JSON.parse(sessionStorage['reference-gen']);
    } catch(e) {
      artigos = [
        {
          id: '1º artigo',
          texto: '',
          total: 0,
          titulo: '',
        }
      ];
    }

    this.setState(update(this.state, {
      artigos: {$set: artigos},
    }));

    setInterval(() => {
      let artigos = JSON.stringify(this.state.artigos);
      sessionStorage['reference-gen'] = artigos;
    }, 15000);
  }

  gerarEBaixar() {
    const { artigos } = this.state;
    let csv = '';
    let i = 0;

    for(let artigo of artigos) {
      for(let referencia of artigo.texto.split('\n\n')) {
        csv += `${i+1}|${referencia}\n`;
      }      
      i++;
    }

    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = `referencias-${DateTime.local().toFormat('dd-LL-yyyy-hh-mm-ss')}.csv`;
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
          total: 0,
          titulo: this.xml[len] || '',
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

  contarReferencias(i) {
    const { artigos } = this.state;

    const texto = artigos[i].texto;

    this.setState(update(this.state, {
      artigos: {
        [i]: {total: {$set: (texto == '' ? 0 : 
          (texto.match(/\n\n/g) || []).length + 1)
        }},
      }
    }));
  }

  formatar(i) {
    const { artigos } = this.state;

    const formatado = quebrarReferencias(artigos[i].texto);

    this.setState(update(this.state, {
      artigos: {
        [i]: {
          texto: {$set: formatado.join('\n\n')},
          total: {$set: formatado.length},
        },
      }
    }));
  }

  onFileChanged(e) {
    const file = e.target.files[0];

    if (!file) return;

    var reader = new FileReader();

    reader.onload = e => {
      const data = e.target.result;
      const $ = cheerio.load(data);
      const titles = $('issue articles article title[locale="pt_BR"]')
        .map((i, el) => {
          return $(el).text();
        }).get();
      this.xml = titles;

      alert('Carregado!');

      this.setState(update(this.state, {
        artigos: artigos => artigos.map((artigo, i) => update(
          artigo, {
            titulo: {$set: titles[i] || ''},
          }
        ))
      }));
    };

    reader.readAsText(file);
  }

  onCarregarCSV(e) {
    const file = e.target.files[0];

    if (!file) return;

    var reader = new FileReader();

    reader.onload = e => {
      const result = e.target.result;
      const linhas = result.split('\n');
      const dict = {};
      const artigos = [];

      linhas.forEach(linha => {
        if (linha == '') return;

        const [num = '', referencia = ''] = linha.split('|') ;
        const key = `${num} º artigo`;
        if (!dict[key]) {
          dict[key] = [];
        }

        dict[key].push(referencia);
      });

      for(let key in dict) {
        const [num] = key.split(' º artigo');
        const texto = dict[key].join('\n\n');

        artigos.push({
          id: key,
          texto: texto,
          total: (texto.match(/\n\n/g) || []).length + 1,
          titulo: this.xml[num] || '',          
        });
      }
      alert('Carregado!');

      this.setState(update(this.state, {
        artigos: {$set: artigos},
      }));
    };

    reader.readAsText(file);
  }

  limpar() {
    if (window.confirm("Você já baixou o XML antes de apagar?")) {
      this.setState(update(this.state, {
        artigos: {$set: []},
      }))
    }
  }

  render() {
    const { artigos } = this.state;
    const navs = [];
    const tabs = [];
    let i = 0;

    for(let artigo of artigos) {
      navs.push(
        <Nav.Item key={`nav-${artigo.id}`}>
          <Nav.Link eventKey={artigo.id}>{artigo.id}</Nav.Link>
        </Nav.Item>
      )

      tabs.push(
        <Tab.Pane eventKey={artigo.id} key={`tab-${artigo.id}`}>
          <div className="float-right mb-2">
            <Button className="mr-2" variant="light" title="Ajustar acentuação" onClick={this.ajustar.bind(this, i)}>
            <i className="fas fa-pen-fancy"></i>
            </Button>
            <Button variant="light" title="Formatar" onClick={this.formatar.bind(this, i)}>
              <i className="fas fa-font"></i>
            </Button>
          </div>
          <Form.Control
            as="input"
            value={artigo.titulo || ''}
            readOnly
            className="mb-2"
          />
          <Form.Control
            as="textarea"
            onChange={this.onTextoChanged.bind(this, i)}
            value={artigo.texto}
            rows="9"
            onBlur={this.contarReferencias.bind(this, i)}
          />
          <Form.Text className="text-muted">
            As referencias deve ser separado por uma quebra de linha entre si.
          </Form.Text>
          <div className="float-right mt-2">Total de referencias após formatação: {artigo.total || 0}</div>
        </Tab.Pane>
      )
      
      i++;
    }

    return (
      <div className="App">
        <Container>
          <Row>
            <Col>
              <div className="mb-2">
                <Button variant="success" title="Gerar e baixar CSV" onClick={this.gerarEBaixar}>
                  <i className="fas fa-download"></i> Gerar & Baixar
                </Button>
              </div>
              <div>
                <Button variant="danger" title="Gerar e baixar CSV" onClick={this.limpar}>
                  <i class="fas fa-trash"></i> Limpar
                </Button>
              </div>
            </Col>
            <Col>
              <div className="form-group">
                <label for="backup">Carregar CSV</label>
                <input type="file" className="form-control-file" name="backup" id="backup" onChange={this.onCarregarCSV} />
              </div>
              <div className="form-group">
                <label for="xmlsbsi">XML do SBSI</label>
                <input type="file" className="form-control-file" name="xmlsbsi" id="xmlsbsi" onChange={this.onFileChanged} />
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <Tab.Container id="left-tabs-example" defaultActiveKey="1º artigo">
                <Row>
                  <Col sm={3} style={{maxHeight: '350px', overflow: 'auto'}}>
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
                <i className="fas fa-plus-circle"></i>
              </Button>
              <Button variant="warning" title="Remover um artigo" onClick={this.removeArtigo}>
                <i className="fas fa-minus-circle"></i>
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
