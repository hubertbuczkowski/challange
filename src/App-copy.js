
import React, { Component } from 'react';
import './App.css';
import Picture from './main/Picture.js';
import SearchBar from './main/SearchBar.js';
f

async function returnPicture(id){
  var address = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&photo_id=";
  var addressPic = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&photo_id=";
  var apikey = "&api_key=8250409f4d662f4a4a8d02670fb633fa";
  var secret = "&secret="+id.secret
  var format = "&format=json&nojsoncallback=1";
  var deta = await fetch(address+id.id+secret+apikey+format).then(data => data.json());
  var pict = await fetch(addressPic+id.id+apikey+format).then(data => data.json());
  let [picture, details] = await Promise.all([pict,deta]);
  return {pic: picture.sizes.size[picture.sizes.size.length-1], det: details}
}

async function loadImages(search){
  var address = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&text=';
  var apikey = "&api_key=8250409f4d662f4a4a8d02670fb633fa";
  var per_page = '&per_page=20';
  var format = '&format=json&nojsoncallback=1';
  var ret = await fetch(address+search+apikey+format+per_page)
                  .then(response => response.json())

  var ret2 = await ret.photos.photo.map(returnPicture)
  return ret2;
}

async function returnMap(obj){
  var data = await obj;
  var date = new Date(data.det.photo.dates.taken);
  var tags = data.det.photo.tags.tag;
  var newObject = {
    picture: data.pic.url,
    tags: tags.toString(),
    title: data.det.photo.title._content,
    owner: data.det.photo.owner.realName?data.det.owner.realName:'data.det.owner.username',
    date: date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear(),
    link: data.det.photo.urls.url[0]._content
  }
  return newObject
}

// async function generatePictures(){
//   var exp;
//   try {
//       const [data] = await Promise.all([
//         loadImages('lamp'),
//       ]);
//       return data
//     } catch (e) {
//       if (exp == null) {
//         console.log(e.toString())
//       }
//     }
//   // var formatted = data.map(returnMap);
// }

function mapToObject(map){
  return (<Picture pass={map}/>)
}


class App extends Component {

  state = {pictures: null, rendered: false, pictureRaw: null, finished: false};
  temp = null;
  generatePictures = async() => {
      loadImages('lamp').then(data => this.setState({pictureRaw: data, rendered: true}))

      // .then(data => {
      //   data.map(returnMap);
      //   data.map(mapToObject);
      //   this.setState({pictures:data})
      // });


  //   loadImages('lamp').then(prom=> {return Promise.resolve(prom)}).then((data) => {
  //       data.map(returnMap);
  //       data.map(mapToObject);
  //       this.setState({pictures: data})
  // })
}

  componentDidMount() {

    if(this.state.rendered===false){
      this.generatePictures()
    }
  }

  render() {
    console.log(this.state.pictureRaw)
    return (
      <div className="App">
        <SearchBar/>
      </div>
    );
  }
}

export default App;

//http://farm5.static.flickr.com/4842/46279908612_9df3b77a02.jpg
// <Picture value={this.picture} randomData={loadImages('lamp')}/>
