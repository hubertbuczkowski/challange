
import React, { Component } from 'react';
import './App.css';
import Picture from './main/Picture.js';
import SearchBar from './main/SearchBar.js';
import Masonry from 'react-masonry-component';

function getFetch(str){
  return fetch(str).then(data => data.json());
}

function returnPicture(id){
  var address = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&photo_id=";
  var addressPic = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&photo_id=";
  var apikey = "&api_key=8250409f4d662f4a4a8d02670fb633fa";
  var secret = "&secret="+id.secret
  var format = "&format=json&nojsoncallback=1";
  return Promise.all([getFetch(address+id.id+secret+apikey+format),getFetch(addressPic+id.id+apikey+format)])
}

function loadImages(search, page){
  var address = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&text=';
  var apikey = "&api_key=8250409f4d662f4a4a8d02670fb633fa";
  var per_page = '&per_page=30&page=';
  var format = '&format=json&nojsoncallback=1';
  var numbers = 0;
  return getFetch(address+search+apikey+format+per_page+page)
}

function imagesToDetails(search, page)
{
    return Promise.all([loadImages(search, page)])
                  .then(([data]) => {
                    data.photos.photo = data.photos.photo.map(element =>
                      {
                        return returnPicture(element)
                      }
                    )
                    return Promise.all([data.photos.photo, data.photos.pages])
                  })
}

function returnMap([detail, photo]){
  var date = new Date(detail.photo.dates.taken);
  var tags = detail.photo.tags.tag;
  var newObject = {
    picture: photo.sizes.size[photo.sizes.size.length-3].source,
    tags: tags,
    title: detail.photo.title._content,
    owner: detail.photo.owner.realname ? detail.photo.owner.realname : detail.photo.owner.username,
    date: date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear(),
    link: detail.photo.urls.url[0]._content
  }
  return newObject
}

function mapToObject(map){
  return (<Picture element={map}/>)
}

function loadMore(search, page){
  var data = generatePictures(search, page).then(([data, pages]) => {
    return Promise.all(data[0]).then(datas => {
      datas = datas.map(returnMap);
      datas = datas.map(mapToObject);
      return datas;
    })
  })
  return data;
}

function generatePictures(search, page) {
    return Promise.all([imagesToDetails(search, page)])
}
class App extends Component {

  state = {pictures: null, hasMore: false, page: 0, pages: 0, search: 'computer'};
  temp = null;

  newSearch = (search) => {
    generatePictures(search, 1).then(([data, pages]) => {
      Promise.all(data[0]).then(datas => {
        datas = datas.map(returnMap);
        datas = datas.map(mapToObject);
        this.setState({pictures: datas, page: 1, pages: data[1], search: search})
      })
    })
  }

  handleScroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && this.state.page<this.state.pages) {
      Promise.all([loadMore(this.state.search, this.state.page+1)]).then(([data, pages]) =>{
        console.log(pages);
        this.setState({pictures: this.state.pictures.concat(data), page: this.state.page+1})
      })
    }
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);

    // Promise.all([loadMore(this.state.search, 1)]).then(([data, pages]) =>{
    //   this.setState({pictures: data, page: 1, pages: pages})
    // })
    generatePictures(this.state.search, 1).then(([data, pages]) => {
      Promise.all(data[0]).then(datas => {
        datas = datas.map(returnMap);
        datas = datas.map(mapToObject);
        this.setState({pictures: datas, page: 1, pages: data[1]})
      })
    })
  }

  render() {
    return (
      <div className="App">
        <SearchBar search={this.newSearch}/>
        <div className={'masonry'}>
          <Masonry
              className={'masonry'}
              options={{isFitWidth:true}}
              disableImagesLoaded={false}
              updateOnEachImageLoad={true}
            >
            {this.state.pictures}
          </Masonry>
        </div>
      </div>
    );
  }
}

export default App;
