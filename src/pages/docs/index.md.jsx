import React from 'react';
import ReactDOM from 'react-dom';
import cookie from 'js-cookie';
import Language from '../../components/language';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Md2Html from '../../components/md2html';
import Sidemenu from '../../components/sidemenu';
import siteConfig from '../../../site_config/site';
import docs120Config from '../../../site_config/docs1-2-0';
import docs121Config from '../../../site_config/docs1-2-1';
import docs131Config from '../../../site_config/docs1-3-1';
import docs132Config from '../../../site_config/docs1-3-2';
import docs133Config from '../../../site_config/docs1-3-3';
import docs134Config from '../../../site_config/docs1-3-4';
import docs135Config from '../../../site_config/docs1-3-5';
import docs136Config from '../../../site_config/docs1-3-6';
import docs138Config from '../../../site_config/docs1-3-8';
import docsDevConfig from '../../../site_config/docsdev';

const docsSource = {
  '1.2.0': docs120Config,
  '1.2.1': docs121Config,
  '1.3.1': docs131Config,
  '1.3.2': docs132Config,
  '1.3.3': docs133Config,
  '1.3.4': docs134Config,
  '1.3.5': docs135Config,
  '1.3.6': docs136Config,
  '1.3.8': docs138Config,
  'dev': docsDevConfig,
};

const isValidVersion = version => version && docsSource.hasOwnProperty(version);

class Docs extends Md2Html(Language) {
  render() {
    const language = this.getLanguage();
    let dataSource = {};
    // from location path
    let version = window.location.pathname.split('/')[3];
    if (isValidVersion(version) || version === 'latest') {
      cookie.set('docs_version', version);
    }
    // from rendering html
    if (!version && this.props.subdir) {
      version = this.props.subdir.split('/')[0];
    }
    if (isValidVersion(version)) {
      dataSource = docsSource[version][language];
    } else if (isValidVersion(cookie.get('docs_version'))) {
      dataSource = docsSource[cookie.get('docs_version')][language];
    } else if (isValidVersion(siteConfig.docsLatest)) {
      dataSource = docsSource[siteConfig.docsLatest][language];
      dataSource.sidemenu.forEach((menu) => {
        menu.children.forEach((submenu) => {
          submenu.link = submenu.link.replace(`docs/${siteConfig.docsLatest}`, 'docs/latest');
        });
      });
    } else {
      return null;
    }
    const __html = this.props.__html || this.state.__html;
    return (
      <div className="md2html docs-page">
        <Header
          currentKey="docs"
          type="dark"
          logo="/img/hlogo_white.svg"
          language={language}
          onLanguageChange={this.onLanguageChange}
        />
        <section className="content-section">
          <Sidemenu dataSource={dataSource.sidemenu} />
          <div
            className="doc-content markdown-body"
            ref={(node) => { this.markdownContainer = node; }}
            dangerouslySetInnerHTML={{ __html }}
          />
        </section>
        <Footer logo="/img/ds_gray.svg" language={language} />
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<Docs />, document.getElementById('root'));

export default Docs;
