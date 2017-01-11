import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';
import { fromJS, get } from 'immutable'; // temporary

import Button from 'elements/Button';

// Draft.js editor & plugins:
import Editor from 'draft-js-plugins-editor';
import { EditorState, CompositeDecorator } from 'draft-js';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';

// Draft.js plugin setup:
const mentionPlugin = createMentionPlugin({
    mentions,
    mentionComponent: (props) => (
        <span className={ props.className } onClick={() => console.log(props.mention.get("link")) } >
            { props.decoratedText }
        </span>
    ),
});
const { MentionSuggestions } = mentionPlugin;

const linkifyPlugin = createLinkifyPlugin({
    component: (props) => (
        <a {...props} className="editor-link" />
    )
});

const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions } = emojiPlugin;

// temporary fake data for mentions menu:
const mentions = fromJS([
    {
  "name": "Frank Alvarez",
  "link": "https://youtu.be/iaculis/congue.xml?congue=vel&vivamus=lectus&metus=in&arcu=quam&adipiscing=fringilla&molestie=rhoncus&hendrerit=mauris&at=enim&vulputate=leo&vitae=rhoncus&nisl=sed&aenean=vestibulum&lectus=sit&pellentesque=amet&eget=cursus&nunc=id&donec=turpis&quis=integer&orci=aliquet&eget=massa&orci=id",
  "avatar": "https://robohash.org/quiadoloressed.png?size=50x50&set=set1"
}, {
  "name": "Joan Fuller",
  "link": "http://ihg.com/quisque/ut/erat/curabitur/gravida/nisi.xml?ut=faucibus&at=cursus&dolor=urna&quis=ut&odio=tellus&consequat=nulla&varius=ut&integer=erat&ac=id&leo=mauris&pellentesque=vulputate&ultrices=elementum&mattis=nullam",
  "avatar": "https://robohash.org/quamexaut.bmp?size=50x50&set=set1"
}, {
  "name": "Kimberly Reid",
  "link": "http://angelfire.com/amet/cursus/id/turpis/integer.jsp?non=enim&ligula=in&pellentesque=tempor&ultrices=turpis&phasellus=nec&id=euismod&sapien=scelerisque&in=quam&sapien=turpis&iaculis=adipiscing&congue=lorem&vivamus=vitae&metus=mattis&arcu=nibh&adipiscing=ligula&molestie=nec&hendrerit=sem&at=duis&vulputate=aliquam&vitae=convallis&nisl=nunc&aenean=proin&lectus=at&pellentesque=turpis&eget=a&nunc=pede&donec=posuere&quis=nonummy&orci=integer&eget=non&orci=velit&vehicula=donec&condimentum=diam&curabitur=neque&in=vestibulum&libero=eget&ut=vulputate&massa=ut&volutpat=ultrices&convallis=vel&morbi=augue&odio=vestibulum&odio=ante&elementum=ipsum&eu=primis&interdum=in&eu=faucibus&tincidunt=orci&in=luctus&leo=et&maecenas=ultrices&pulvinar=posuere&lobortis=cubilia&est=curae&phasellus=donec&sit=pharetra&amet=magna&erat=vestibulum&nulla=aliquet&tempus=ultrices&vivamus=erat&in=tortor&felis=sollicitudin&eu=mi&sapien=sit&cursus=amet&vestibulum=lobortis&proin=sapien&eu=sapien&mi=non&nulla=mi&ac=integer&enim=ac&in=neque&tempor=duis&turpis=bibendum&nec=morbi&euismod=non&scelerisque=quam&quam=nec&turpis=dui&adipiscing=luctus&lorem=rutrum",
  "avatar": "https://robohash.org/utquiaaut.png?size=50x50&set=set1"
}, {
  "name": "Brian Davis",
  "link": "http://ted.com/libero/ut/massa/volutpat/convallis.js?accumsan=erat&odio=fermentum&curabitur=justo&convallis=nec&duis=condimentum&consequat=neque&dui=sapien&nec=placerat&nisi=ante&volutpat=nulla&eleifend=justo&donec=aliquam&ut=quis&dolor=turpis&morbi=eget&vel=elit&lectus=sodales&in=scelerisque&quam=mauris&fringilla=sit&rhoncus=amet&mauris=eros&enim=suspendisse&leo=accumsan&rhoncus=tortor&sed=quis&vestibulum=turpis&sit=sed&amet=ante&cursus=vivamus&id=tortor&turpis=duis&integer=mattis&aliquet=egestas&massa=metus&id=aenean&lobortis=fermentum&convallis=donec",
  "avatar": "https://robohash.org/esteaquequidem.jpg?size=50x50&set=set1"
}, {
  "name": "Patrick Phillips",
  "link": "http://cdc.gov/integer.jpg?potenti=at&nullam=vulputate&porttitor=vitae&lacus=nisl&at=aenean&turpis=lectus&donec=pellentesque&posuere=eget&metus=nunc&vitae=donec&ipsum=quis&aliquam=orci&non=eget&mauris=orci&morbi=vehicula&non=condimentum&lectus=curabitur&aliquam=in&sit=libero",
  "avatar": "https://robohash.org/repudiandaeutaut.jpg?size=50x50&set=set1"
}, {
  "name": "Cheryl Moore",
  "link": "https://friendfeed.com/pellentesque.xml?turpis=condimentum&enim=id&blandit=luctus&mi=nec&in=molestie&porttitor=sed&pede=justo&justo=pellentesque&eu=viverra&massa=pede&donec=ac&dapibus=diam&duis=cras&at=pellentesque&velit=volutpat&eu=dui&est=maecenas&congue=tristique&elementum=est&in=et&hac=tempus&habitasse=semper&platea=est&dictumst=quam&morbi=pharetra&vestibulum=magna&velit=ac&id=consequat&pretium=metus&iaculis=sapien&diam=ut&erat=nunc&fermentum=vestibulum&justo=ante&nec=ipsum&condimentum=primis&neque=in&sapien=faucibus&placerat=orci&ante=luctus&nulla=et&justo=ultrices&aliquam=posuere&quis=cubilia&turpis=curae&eget=mauris",
  "avatar": "https://robohash.org/rerumeasimilique.jpg?size=50x50&set=set1"
}, {
  "name": "Anna Ford",
  "link": "https://scientificamerican.com/nibh/ligula/nec/sem.jsp?primis=nascetur&in=ridiculus&faucibus=mus&orci=vivamus&luctus=vestibulum&et=sagittis&ultrices=sapien&posuere=cum&cubilia=sociis&curae=natoque&donec=penatibus&pharetra=et&magna=magnis&vestibulum=dis&aliquet=parturient&ultrices=montes&erat=nascetur&tortor=ridiculus&sollicitudin=mus&mi=etiam&sit=vel&amet=augue&lobortis=vestibulum&sapien=rutrum&sapien=rutrum&non=neque&mi=aenean&integer=auctor&ac=gravida&neque=sem",
  "avatar": "https://robohash.org/idillumquibusdam.bmp?size=50x50&set=set1"
}, {
  "name": "Paul Pierce",
  "link": "http://walmart.com/est/et/tempus/semper/est/quam.jpg?scelerisque=sapien&mauris=ut&sit=nunc&amet=vestibulum&eros=ante&suspendisse=ipsum&accumsan=primis&tortor=in&quis=faucibus&turpis=orci&sed=luctus&ante=et&vivamus=ultrices&tortor=posuere&duis=cubilia&mattis=curae&egestas=mauris&metus=viverra&aenean=diam&fermentum=vitae&donec=quam&ut=suspendisse&mauris=potenti&eget=nullam&massa=porttitor&tempor=lacus&convallis=at&nulla=turpis&neque=donec&libero=posuere&convallis=metus&eget=vitae&eleifend=ipsum&luctus=aliquam&ultricies=non&eu=mauris&nibh=morbi&quisque=non&id=lectus&justo=aliquam&sit=sit&amet=amet&sapien=diam&dignissim=in&vestibulum=magna&vestibulum=bibendum&ante=imperdiet&ipsum=nullam&primis=orci&in=pede&faucibus=venenatis&orci=non&luctus=sodales&et=sed&ultrices=tincidunt&posuere=eu&cubilia=felis&curae=fusce&nulla=posuere&dapibus=felis&dolor=sed&vel=lacus&est=morbi&donec=sem",
  "avatar": "https://robohash.org/utnonfugit.bmp?size=50x50&set=set1"
}, {
  "name": "Julia Jordan",
  "link": "https://rambler.ru/vivamus/vestibulum.html?augue=tortor&quam=risus&sollicitudin=dapibus&vitae=augue&consectetuer=vel&eget=accumsan&rutrum=tellus&at=nisi&lorem=eu&integer=orci&tincidunt=mauris&ante=lacinia&vel=sapien&ipsum=quis&praesent=libero&blandit=nullam&lacinia=sit&erat=amet&vestibulum=turpis&sed=elementum&magna=ligula&at=vehicula&nunc=consequat&commodo=morbi&placerat=a&praesent=ipsum&blandit=integer&nam=a&nulla=nibh&integer=in&pede=quis&justo=justo&lacinia=maecenas&eget=rhoncus&tincidunt=aliquam&eget=lacus&tempus=morbi&vel=quis&pede=tortor&morbi=id&porttitor=nulla&lorem=ultrices&id=aliquet&ligula=maecenas&suspendisse=leo&ornare=odio&consequat=condimentum&lectus=id&in=luctus&est=nec&risus=molestie&auctor=sed&sed=justo",
  "avatar": "https://robohash.org/suscipitinodio.bmp?size=50x50&set=set1"
}, {
  "name": "Paul West",
  "link": "http://livejournal.com/turpis/adipiscing/lorem/vitae.js?curae=imperdiet&duis=sapien&faucibus=urna&accumsan=pretium&odio=nisl&curabitur=ut&convallis=volutpat&duis=sapien&consequat=arcu&dui=sed&nec=augue&nisi=aliquam&volutpat=erat&eleifend=volutpat&donec=in&ut=congue&dolor=etiam&morbi=justo&vel=etiam&lectus=pretium&in=iaculis&quam=justo&fringilla=in&rhoncus=hac&mauris=habitasse&enim=platea&leo=dictumst&rhoncus=etiam&sed=faucibus&vestibulum=cursus&sit=urna&amet=ut&cursus=tellus&id=nulla&turpis=ut&integer=erat&aliquet=id&massa=mauris&id=vulputate&lobortis=elementum&convallis=nullam&tortor=varius&risus=nulla&dapibus=facilisi&augue=cras&vel=non&accumsan=velit&tellus=nec&nisi=nisi&eu=vulputate&orci=nonummy&mauris=maecenas&lacinia=tincidunt&sapien=lacus&quis=at&libero=velit&nullam=vivamus&sit=vel&amet=nulla&turpis=eget&elementum=eros&ligula=elementum&vehicula=pellentesque&consequat=quisque&morbi=porta&a=volutpat&ipsum=erat&integer=quisque&a=erat&nibh=eros&in=viverra&quis=eget&justo=congue&maecenas=eget&rhoncus=semper&aliquam=rutrum&lacus=nulla&morbi=nunc&quis=purus&tortor=phasellus&id=in&nulla=felis&ultrices=donec&aliquet=semper&maecenas=sapien&leo=a",
  "avatar": "https://robohash.org/culpaodiounde.png?size=50x50&set=set1"
}, {
  "name": "Ralph Knight",
  "link": "https://irs.gov/morbi.aspx?rhoncus=mattis&aliquam=egestas&lacus=metus&morbi=aenean&quis=fermentum&tortor=donec&id=ut&nulla=mauris&ultrices=eget&aliquet=massa&maecenas=tempor&leo=convallis&odio=nulla&condimentum=neque&id=libero&luctus=convallis&nec=eget&molestie=eleifend&sed=luctus&justo=ultricies&pellentesque=eu&viverra=nibh&pede=quisque&ac=id&diam=justo&cras=sit&pellentesque=amet&volutpat=sapien&dui=dignissim&maecenas=vestibulum&tristique=vestibulum&est=ante&et=ipsum&tempus=primis&semper=in&est=faucibus&quam=orci&pharetra=luctus&magna=et&ac=ultrices&consequat=posuere&metus=cubilia&sapien=curae&ut=nulla&nunc=dapibus&vestibulum=dolor&ante=vel&ipsum=est&primis=donec&in=odio&faucibus=justo&orci=sollicitudin&luctus=ut&et=suscipit&ultrices=a&posuere=feugiat&cubilia=et&curae=eros&mauris=vestibulum&viverra=ac&diam=est&vitae=lacinia&quam=nisi&suspendisse=venenatis&potenti=tristique&nullam=fusce&porttitor=congue&lacus=diam&at=id&turpis=ornare&donec=imperdiet&posuere=sapien&metus=urna&vitae=pretium&ipsum=nisl&aliquam=ut&non=volutpat&mauris=sapien&morbi=arcu&non=sed&lectus=augue&aliquam=aliquam&sit=erat&amet=volutpat&diam=in&in=congue&magna=etiam&bibendum=justo&imperdiet=etiam&nullam=pretium&orci=iaculis&pede=justo&venenatis=in",
  "avatar": "https://robohash.org/pariaturipsamquod.jpg?size=50x50&set=set1"
}, {
  "name": "Julia Bowman",
  "link": "https://ifeng.com/nisl/duis/ac/nibh/fusce/lacus/purus.aspx?sed=velit&justo=nec&pellentesque=nisi&viverra=vulputate&pede=nonummy&ac=maecenas&diam=tincidunt&cras=lacus&pellentesque=at&volutpat=velit&dui=vivamus&maecenas=vel&tristique=nulla&est=eget&et=eros&tempus=elementum&semper=pellentesque&est=quisque&quam=porta&pharetra=volutpat&magna=erat&ac=quisque&consequat=erat&metus=eros&sapien=viverra&ut=eget&nunc=congue&vestibulum=eget&ante=semper&ipsum=rutrum&primis=nulla&in=nunc&faucibus=purus&orci=phasellus&luctus=in&et=felis&ultrices=donec&posuere=semper&cubilia=sapien&curae=a&mauris=libero&viverra=nam&diam=dui&vitae=proin&quam=leo&suspendisse=odio&potenti=porttitor&nullam=id&porttitor=consequat&lacus=in&at=consequat&turpis=ut&donec=nulla&posuere=sed&metus=accumsan&vitae=felis&ipsum=ut&aliquam=at&non=dolor&mauris=quis&morbi=odio&non=consequat&lectus=varius&aliquam=integer&sit=ac&amet=leo&diam=pellentesque&in=ultrices&magna=mattis&bibendum=odio&imperdiet=donec&nullam=vitae&orci=nisi&pede=nam&venenatis=ultrices&non=libero&sodales=non&sed=mattis&tincidunt=pulvinar&eu=nulla&felis=pede&fusce=ullamcorper&posuere=augue",
  "avatar": "https://robohash.org/autemfugiatexpedita.jpg?size=50x50&set=set1"
}, {
  "name": "Shawn Johnston",
  "link": "https://google.fr/dolor/sit/amet.aspx?potenti=semper&cras=sapien&in=a&purus=libero&eu=nam&magna=dui&vulputate=proin&luctus=leo&cum=odio&sociis=porttitor&natoque=id&penatibus=consequat&et=in&magnis=consequat&dis=ut&parturient=nulla&montes=sed&nascetur=accumsan&ridiculus=felis&mus=ut&vivamus=at&vestibulum=dolor&sagittis=quis&sapien=odio&cum=consequat&sociis=varius&natoque=integer&penatibus=ac&et=leo&magnis=pellentesque&dis=ultrices&parturient=mattis&montes=odio&nascetur=donec&ridiculus=vitae&mus=nisi&etiam=nam&vel=ultrices&augue=libero&vestibulum=non&rutrum=mattis&rutrum=pulvinar&neque=nulla&aenean=pede&auctor=ullamcorper&gravida=augue&sem=a&praesent=suscipit&id=nulla&massa=elit&id=ac&nisl=nulla&venenatis=sed&lacinia=vel&aenean=enim&sit=sit&amet=amet&justo=nunc&morbi=viverra&ut=dapibus&odio=nulla&cras=suscipit&mi=ligula&pede=in&malesuada=lacus&in=curabitur&imperdiet=at&et=ipsum&commodo=ac&vulputate=tellus&justo=semper&in=interdum&blandit=mauris&ultrices=ullamcorper&enim=purus&lorem=sit&ipsum=amet&dolor=nulla&sit=quisque&amet=arcu&consectetuer=libero&adipiscing=rutrum&elit=ac&proin=lobortis",
  "avatar": "https://robohash.org/eanonrerum.png?size=50x50&set=set1"
}, {
  "name": "Ashley Gomez",
  "link": "https://google.co.uk/habitasse/platea/dictumst/morbi/vestibulum/velit/id.js?integer=mi&tincidunt=sit&ante=amet&vel=lobortis&ipsum=sapien&praesent=sapien&blandit=non&lacinia=mi&erat=integer&vestibulum=ac&sed=neque&magna=duis&at=bibendum&nunc=morbi&commodo=non&placerat=quam&praesent=nec&blandit=dui&nam=luctus&nulla=rutrum&integer=nulla&pede=tellus&justo=in&lacinia=sagittis&eget=dui&tincidunt=vel&eget=nisl&tempus=duis&vel=ac&pede=nibh&morbi=fusce&porttitor=lacus&lorem=purus&id=aliquet&ligula=at",
  "avatar": "https://robohash.org/nonquibusdamsunt.png?size=50x50&set=set1"
}, {
  "name": "Catherine Nelson",
  "link": "http://angelfire.com/at/nulla/suspendisse/potenti/cras/in/purus.html?ut=vestibulum&dolor=aliquet&morbi=ultrices&vel=erat&lectus=tortor&in=sollicitudin&quam=mi&fringilla=sit&rhoncus=amet&mauris=lobortis&enim=sapien&leo=sapien&rhoncus=non&sed=mi&vestibulum=integer&sit=ac&amet=neque&cursus=duis&id=bibendum&turpis=morbi&integer=non&aliquet=quam&massa=nec&id=dui&lobortis=luctus&convallis=rutrum&tortor=nulla&risus=tellus&dapibus=in&augue=sagittis&vel=dui&accumsan=vel&tellus=nisl&nisi=duis&eu=ac&orci=nibh&mauris=fusce&lacinia=lacus&sapien=purus&quis=aliquet&libero=at&nullam=feugiat&sit=non&amet=pretium&turpis=quis&elementum=lectus&ligula=suspendisse&vehicula=potenti&consequat=in&morbi=eleifend&a=quam&ipsum=a&integer=odio&a=in&nibh=hac&in=habitasse&quis=platea&justo=dictumst&maecenas=maecenas&rhoncus=ut&aliquam=massa&lacus=quis&morbi=augue&quis=luctus&tortor=tincidunt&id=nulla&nulla=mollis&ultrices=molestie&aliquet=lorem&maecenas=quisque&leo=ut&odio=erat&condimentum=curabitur&id=gravida&luctus=nisi&nec=at&molestie=nibh&sed=in&justo=hac&pellentesque=habitasse&viverra=platea&pede=dictumst&ac=aliquam&diam=augue&cras=quam&pellentesque=sollicitudin&volutpat=vitae&dui=consectetuer&maecenas=eget&tristique=rutrum&est=at&et=lorem&tempus=integer&semper=tincidunt&est=ante&quam=vel",
  "avatar": "https://robohash.org/accusantiuminventoresaepe.jpg?size=50x50&set=set1"
}, {
  "name": "Wayne Ryan",
  "link": "http://cnbc.com/enim/sit/amet/nunc/viverra.json?dictumst=lorem&morbi=quisque&vestibulum=ut&velit=erat&id=curabitur&pretium=gravida&iaculis=nisi&diam=at&erat=nibh&fermentum=in&justo=hac&nec=habitasse&condimentum=platea&neque=dictumst&sapien=aliquam&placerat=augue&ante=quam&nulla=sollicitudin&justo=vitae&aliquam=consectetuer&quis=eget&turpis=rutrum&eget=at&elit=lorem&sodales=integer&scelerisque=tincidunt&mauris=ante&sit=vel&amet=ipsum&eros=praesent&suspendisse=blandit&accumsan=lacinia&tortor=erat&quis=vestibulum&turpis=sed&sed=magna&ante=at&vivamus=nunc&tortor=commodo&duis=placerat&mattis=praesent&egestas=blandit&metus=nam",
  "avatar": "https://robohash.org/eaaccusantiumomnis.jpg?size=50x50&set=set1"
}, {
  "name": "Victor Medina",
  "link": "https://mapy.cz/parturient/montes/nascetur/ridiculus.js?orci=vivamus&luctus=vestibulum&et=sagittis&ultrices=sapien&posuere=cum&cubilia=sociis&curae=natoque&mauris=penatibus&viverra=et&diam=magnis&vitae=dis&quam=parturient&suspendisse=montes&potenti=nascetur&nullam=ridiculus&porttitor=mus&lacus=etiam&at=vel&turpis=augue&donec=vestibulum&posuere=rutrum&metus=rutrum&vitae=neque&ipsum=aenean&aliquam=auctor&non=gravida&mauris=sem&morbi=praesent&non=id&lectus=massa&aliquam=id&sit=nisl&amet=venenatis&diam=lacinia&in=aenean&magna=sit&bibendum=amet&imperdiet=justo&nullam=morbi&orci=ut&pede=odio&venenatis=cras&non=mi&sodales=pede&sed=malesuada&tincidunt=in&eu=imperdiet&felis=et&fusce=commodo&posuere=vulputate&felis=justo&sed=in&lacus=blandit&morbi=ultrices&sem=enim&mauris=lorem&laoreet=ipsum&ut=dolor&rhoncus=sit&aliquet=amet&pulvinar=consectetuer&sed=adipiscing&nisl=elit&nunc=proin&rhoncus=interdum&dui=mauris&vel=non&sem=ligula&sed=pellentesque&sagittis=ultrices&nam=phasellus&congue=id&risus=sapien&semper=in",
  "avatar": "https://robohash.org/quipariaturducimus.png?size=50x50&set=set1"
}, {
  "name": "Angela Thomas",
  "link": "https://goo.ne.jp/tristique/fusce/congue/diam.js?augue=lacus&luctus=purus&tincidunt=aliquet&nulla=at&mollis=feugiat&molestie=non&lorem=pretium&quisque=quis&ut=lectus&erat=suspendisse&curabitur=potenti&gravida=in&nisi=eleifend&at=quam&nibh=a&in=odio&hac=in&habitasse=hac&platea=habitasse&dictumst=platea&aliquam=dictumst&augue=maecenas",
  "avatar": "https://robohash.org/inetqui.bmp?size=50x50&set=set1"
}, {
  "name": "Jacqueline Flores",
  "link": "https://tinyurl.com/et/ultrices/posuere/cubilia/curae/donec.png?molestie=metus&sed=aenean&justo=fermentum&pellentesque=donec&viverra=ut&pede=mauris&ac=eget&diam=massa&cras=tempor&pellentesque=convallis&volutpat=nulla&dui=neque&maecenas=libero&tristique=convallis&est=eget&et=eleifend&tempus=luctus&semper=ultricies&est=eu&quam=nibh&pharetra=quisque&magna=id&ac=justo&consequat=sit&metus=amet&sapien=sapien&ut=dignissim&nunc=vestibulum&vestibulum=vestibulum&ante=ante&ipsum=ipsum&primis=primis&in=in&faucibus=faucibus&orci=orci&luctus=luctus&et=et&ultrices=ultrices&posuere=posuere&cubilia=cubilia&curae=curae&mauris=nulla&viverra=dapibus&diam=dolor&vitae=vel&quam=est&suspendisse=donec&potenti=odio&nullam=justo&porttitor=sollicitudin&lacus=ut&at=suscipit&turpis=a&donec=feugiat&posuere=et&metus=eros",
  "avatar": "https://robohash.org/voluptasautqui.jpg?size=50x50&set=set1"
}, {
  "name": "Donna Nichols",
  "link": "http://geocities.jp/viverra/eget/congue/eget/semper.js?sociis=quis&natoque=augue&penatibus=luctus&et=tincidunt&magnis=nulla&dis=mollis&parturient=molestie&montes=lorem&nascetur=quisque&ridiculus=ut&mus=erat&vivamus=curabitur&vestibulum=gravida&sagittis=nisi&sapien=at&cum=nibh&sociis=in&natoque=hac&penatibus=habitasse&et=platea&magnis=dictumst&dis=aliquam&parturient=augue&montes=quam&nascetur=sollicitudin&ridiculus=vitae&mus=consectetuer&etiam=eget&vel=rutrum&augue=at&vestibulum=lorem&rutrum=integer&rutrum=tincidunt&neque=ante&aenean=vel&auctor=ipsum&gravida=praesent&sem=blandit&praesent=lacinia&id=erat&massa=vestibulum&id=sed&nisl=magna&venenatis=at&lacinia=nunc&aenean=commodo&sit=placerat&amet=praesent&justo=blandit&morbi=nam&ut=nulla&odio=integer",
  "avatar": "https://robohash.org/culpacupiditateaccusantium.png?size=50x50&set=set1"
}, {
  "name": "Teresa Johnston",
  "link": "http://ucoz.ru/sit.png?non=vulputate&lectus=justo&aliquam=in&sit=blandit&amet=ultrices&diam=enim&in=lorem&magna=ipsum&bibendum=dolor&imperdiet=sit&nullam=amet&orci=consectetuer&pede=adipiscing&venenatis=elit&non=proin&sodales=interdum&sed=mauris&tincidunt=non&eu=ligula&felis=pellentesque&fusce=ultrices&posuere=phasellus&felis=id&sed=sapien&lacus=in&morbi=sapien&sem=iaculis&mauris=congue&laoreet=vivamus&ut=metus&rhoncus=arcu&aliquet=adipiscing&pulvinar=molestie&sed=hendrerit&nisl=at&nunc=vulputate&rhoncus=vitae&dui=nisl&vel=aenean&sem=lectus&sed=pellentesque&sagittis=eget&nam=nunc&congue=donec&risus=quis&semper=orci&porta=eget&volutpat=orci&quam=vehicula&pede=condimentum&lobortis=curabitur&ligula=in&sit=libero&amet=ut&eleifend=massa&pede=volutpat&libero=convallis&quis=morbi&orci=odio&nullam=odio&molestie=elementum&nibh=eu&in=interdum&lectus=eu&pellentesque=tincidunt&at=in&nulla=leo&suspendisse=maecenas&potenti=pulvinar&cras=lobortis&in=est&purus=phasellus&eu=sit&magna=amet&vulputate=erat&luctus=nulla&cum=tempus&sociis=vivamus&natoque=in&penatibus=felis&et=eu&magnis=sapien&dis=cursus&parturient=vestibulum&montes=proin&nascetur=eu&ridiculus=mi&mus=nulla&vivamus=ac&vestibulum=enim&sagittis=in",
  "avatar": "https://robohash.org/autlaboreipsum.bmp?size=50x50&set=set1"
}, {
  "name": "Mary Wallace",
  "link": "https://cisco.com/venenatis/turpis/enim/blandit/mi/in.png?pretium=tortor&iaculis=duis&diam=mattis&erat=egestas&fermentum=metus",
  "avatar": "https://robohash.org/officiamolestiaeerror.png?size=50x50&set=set1"
}, {
  "name": "Lawrence Gilbert",
  "link": "https://netscape.com/curabitur.xml?suscipit=diam&nulla=neque&elit=vestibulum&ac=eget&nulla=vulputate&sed=ut&vel=ultrices&enim=vel&sit=augue&amet=vestibulum&nunc=ante&viverra=ipsum&dapibus=primis&nulla=in&suscipit=faucibus&ligula=orci&in=luctus&lacus=et&curabitur=ultrices&at=posuere&ipsum=cubilia&ac=curae&tellus=donec&semper=pharetra&interdum=magna&mauris=vestibulum&ullamcorper=aliquet&purus=ultrices&sit=erat&amet=tortor&nulla=sollicitudin&quisque=mi&arcu=sit&libero=amet&rutrum=lobortis&ac=sapien&lobortis=sapien&vel=non&dapibus=mi&at=integer",
  "avatar": "https://robohash.org/quimolestiaeofficia.bmp?size=50x50&set=set1"
}, {
  "name": "Kimberly Stone",
  "link": "https://blogger.com/sit/amet/nunc/viverra/dapibus/nulla/suscipit.png?purus=elementum&aliquet=nullam&at=varius&feugiat=nulla&non=facilisi&pretium=cras&quis=non&lectus=velit&suspendisse=nec&potenti=nisi&in=vulputate&eleifend=nonummy&quam=maecenas&a=tincidunt&odio=lacus&in=at&hac=velit&habitasse=vivamus&platea=vel&dictumst=nulla&maecenas=eget&ut=eros&massa=elementum&quis=pellentesque&augue=quisque&luctus=porta&tincidunt=volutpat&nulla=erat&mollis=quisque&molestie=erat&lorem=eros&quisque=viverra&ut=eget&erat=congue&curabitur=eget&gravida=semper&nisi=rutrum&at=nulla&nibh=nunc&in=purus&hac=phasellus&habitasse=in&platea=felis&dictumst=donec&aliquam=semper&augue=sapien&quam=a&sollicitudin=libero&vitae=nam&consectetuer=dui&eget=proin&rutrum=leo&at=odio&lorem=porttitor&integer=id&tincidunt=consequat&ante=in",
  "avatar": "https://robohash.org/quiquistempore.png?size=50x50&set=set1"
}, {
  "name": "Ruby Coleman",
  "link": "http://japanpost.jp/eu/felis.jpg?ipsum=donec&dolor=semper&sit=sapien&amet=a&consectetuer=libero&adipiscing=nam&elit=dui&proin=proin&interdum=leo&mauris=odio&non=porttitor&ligula=id&pellentesque=consequat&ultrices=in&phasellus=consequat&id=ut&sapien=nulla&in=sed&sapien=accumsan&iaculis=felis&congue=ut&vivamus=at&metus=dolor&arcu=quis&adipiscing=odio&molestie=consequat&hendrerit=varius&at=integer&vulputate=ac&vitae=leo&nisl=pellentesque&aenean=ultrices&lectus=mattis&pellentesque=odio&eget=donec",
  "avatar": "https://robohash.org/nihildoloremquos.jpg?size=50x50&set=set1"
}, {
  "name": "Helen Lane",
  "link": "http://ask.com/nisl/nunc/rhoncus/dui/vel/sem/sed.json?pretium=amet&quis=diam&lectus=in&suspendisse=magna&potenti=bibendum&in=imperdiet&eleifend=nullam&quam=orci&a=pede&odio=venenatis&in=non&hac=sodales&habitasse=sed&platea=tincidunt&dictumst=eu&maecenas=felis&ut=fusce&massa=posuere&quis=felis&augue=sed&luctus=lacus&tincidunt=morbi&nulla=sem&mollis=mauris&molestie=laoreet&lorem=ut&quisque=rhoncus",
  "avatar": "https://robohash.org/eumsolutaeveniet.bmp?size=50x50&set=set1"
}, {
  "name": "Chris Peters",
  "link": "https://economist.com/amet/consectetuer/adipiscing/elit.aspx?amet=hac&lobortis=habitasse&sapien=platea&sapien=dictumst&non=morbi&mi=vestibulum&integer=velit&ac=id&neque=pretium&duis=iaculis&bibendum=diam&morbi=erat&non=fermentum&quam=justo&nec=nec&dui=condimentum",
  "avatar": "https://robohash.org/quidemnihilfacilis.bmp?size=50x50&set=set1"
}, {
  "name": "Janice Howard",
  "link": "http://marketwatch.com/maecenas/ut/massa/quis/augue/luctus.html?in=lorem&porttitor=quisque&pede=ut&justo=erat&eu=curabitur&massa=gravida&donec=nisi&dapibus=at&duis=nibh&at=in&velit=hac&eu=habitasse&est=platea&congue=dictumst&elementum=aliquam&in=augue&hac=quam&habitasse=sollicitudin&platea=vitae&dictumst=consectetuer&morbi=eget&vestibulum=rutrum&velit=at&id=lorem&pretium=integer&iaculis=tincidunt&diam=ante&erat=vel&fermentum=ipsum&justo=praesent&nec=blandit&condimentum=lacinia&neque=erat&sapien=vestibulum&placerat=sed&ante=magna&nulla=at&justo=nunc&aliquam=commodo&quis=placerat&turpis=praesent&eget=blandit&elit=nam&sodales=nulla&scelerisque=integer&mauris=pede&sit=justo&amet=lacinia&eros=eget&suspendisse=tincidunt&accumsan=eget&tortor=tempus&quis=vel&turpis=pede&sed=morbi",
  "avatar": "https://robohash.org/earumsintvelit.png?size=50x50&set=set1"
}, {
  "name": "Judy Watkins",
  "link": "https://bizjournals.com/aliquet/at/feugiat/non/pretium/quis/lectus.html?quis=nec&libero=dui&nullam=luctus&sit=rutrum&amet=nulla&turpis=tellus&elementum=in&ligula=sagittis&vehicula=dui&consequat=vel&morbi=nisl&a=duis&ipsum=ac&integer=nibh&a=fusce&nibh=lacus&in=purus&quis=aliquet&justo=at&maecenas=feugiat&rhoncus=non&aliquam=pretium&lacus=quis&morbi=lectus&quis=suspendisse&tortor=potenti&id=in&nulla=eleifend&ultrices=quam&aliquet=a&maecenas=odio&leo=in&odio=hac&condimentum=habitasse&id=platea&luctus=dictumst&nec=maecenas&molestie=ut&sed=massa&justo=quis&pellentesque=augue&viverra=luctus&pede=tincidunt&ac=nulla&diam=mollis&cras=molestie&pellentesque=lorem&volutpat=quisque&dui=ut&maecenas=erat&tristique=curabitur&est=gravida&et=nisi&tempus=at&semper=nibh&est=in&quam=hac&pharetra=habitasse&magna=platea&ac=dictumst&consequat=aliquam&metus=augue&sapien=quam&ut=sollicitudin&nunc=vitae&vestibulum=consectetuer&ante=eget",
  "avatar": "https://robohash.org/ipsaharumarchitecto.jpg?size=50x50&set=set1"
}, {
  "name": "Raymond Rodriguez",
  "link": "https://bbc.co.uk/quis/libero/nullam/sit/amet/turpis/elementum.jsp?montes=tincidunt&nascetur=eget&ridiculus=tempus&mus=vel&etiam=pede&vel=morbi&augue=porttitor&vestibulum=lorem&rutrum=id&rutrum=ligula&neque=suspendisse&aenean=ornare&auctor=consequat&gravida=lectus&sem=in&praesent=est&id=risus&massa=auctor&id=sed&nisl=tristique&venenatis=in&lacinia=tempus&aenean=sit&sit=amet&amet=sem&justo=fusce&morbi=consequat&ut=nulla&odio=nisl&cras=nunc",
  "avatar": "https://robohash.org/corruptieiuseum.jpg?size=50x50&set=set1"
}
]);
//

// Draft.js plugins array:
const plugins = [
    mentionPlugin,
    linkifyPlugin,
    emojiPlugin
];

export const HeaderComposeEditor = React.createClass({

    componentWillMount(){

        const compositeDecorator = new CompositeDecorator([
            {
              strategy: this.handleStrategy,
              component: this.HandleSpan,
            },
            {
              strategy: this.hashtagStrategy,
              component: this.HashtagSpan,
            },
        ]);

        this.setState({
            editorState: EditorState.createEmpty(compositeDecorator),
            editorZoomIn: false,
            showEmojiPicker: false,
            suggestions: mentions
        });
    },

    onChange(editorState){
        this.setState({ editorState });
    },

    onSearchChange({ value }){
        this.setState({
            suggestions: defaultSuggestionsFilter(value, mentions),
        });
    },

    onAddMention(){
        // get the mention object selected
    },

    toggleZoomIn(){
        this.setState({ editorZoomIn: !this.state.editorZoomIn })
    },

    toggleEmojiPicker(){
        this.setState({ showEmojiPicker: !this.state.showEmojiPicker })
    },

    handleStrategy(contentBlock, callback){
        const HANDLE_REGEX = /\@[\w]+/g;
        this.findWithRegex(HANDLE_REGEX, contentBlock, callback);
    },

    hashtagStrategy(contentBlock, callback){
        const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;
        this.findWithRegex(HASHTAG_REGEX, contentBlock, callback);
    },

    findWithRegex(regex, contentBlock, callback){
        const text = contentBlock.getText();
        console.log('findWithRegex called with text: ', text);
        let matchArr, start;
        while ((matchArr = regex.exec(text)) !== null) {
            start = matchArr.index;
            callback(start, start + matchArr[0].length);
            console.log(matchArr);
        }
    },

    HandleSpan(props){
        return <span {...props} className="editor-handle">{ props.children }</span>;
    },

    HashtagSpan(props){
        return <span {...props} className="editor-hashtag">{ props.children }</span>;
    },

    render(){

        const { editorState, editorZoomIn, showEmojiPicker } = this.state;

        return (
            <div className="header-compose-post">
                <div className={`header-compose-editor ${ editorZoomIn ? "editor-zoom-in" : "" }`}>
                    <Editor editorState={ editorState }
                            onChange={ this.onChange }
                            placeholder="Share your thoughts"
                            spellCheck={ true }
                            ref="editor"
                            plugins={ plugins }
                            onFocus={ this.toggleZoomIn }
                            onBlur={ this.toggleZoomIn } />
                    <MentionSuggestions
                            onSearchChange={ this.onSearchChange }
                            suggestions={ this.state.suggestions }
                            onAddMention={ this.onAddMention } />
                    <EmojiSuggestions />
                </div>
                <div className="header-compose-button">
                    <Button type="submit" btnType="main" btnText="Share it!" />
                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {

     };
})(HeaderComposeEditor);
