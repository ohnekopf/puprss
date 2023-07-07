#!/usr/bin/env python
from sys import stdin
import re,io,pycurl

def boilin():
    print("<?xml version='1.0' encoding='UTF-8'?>\n")
    print("<rss version=\"2.0\" xmlns:itunes=\"http://www.itunes.com/dtds/podcast-1.0.dtd\" xmlns:atom=\"http://www.w3.org/2005/Atom\">\n")
    print("<channel>\n")
    print("<atom:link href=\"https://ohnekopf.github.io/puprss/elem-puzh.rss\" rel=\"self\" type=\"application/rss+xml\"/>\n")
    print("<title>Popup Chinese: Elementary</title>\n")
    print("<link>http://www.popupchinese.com</link>\n")
    print("<pubDate>Thu, 06 Jul 2023 21:00:00 +0000</pubDate>\n")
    print("<lastBuildDate>Thu, 06 Jul 2023 20:00:00 +0000</lastBuildDate>\n")
    print("<language>en</language>\n")
    print("<copyright>Popup Chinese. This RSS feed is not managed by them</copyright>\n")
    print("<webMaster>ohnekopf at github</webMaster>\n")
    print("<description>Elementary level episodes of mandarin chinese podcast Popup Chinese</description>\n")
    print("<itunes:subtitle>Popup Chinese elementary</itunes:subtitle>\n")
    print("<image> \n")
    print("\t<url>http://popupchinese.org/img/university8.png</url>\n")
    print("\t<title>Popup Chinese</title>\n")
    print("\t<link>http://popupchinese.com/</link>\n")
    print("</image> \n")

#done

def doline(id,url,pdf,audio):
    title=re.split(('[/.]'),pdf)[-2].replace("-" ," ")
    title=title.split()
    title=title[0]+": "+ " ".join(title[1:])

    descr=title + "\n"
    descr+="\t\t<a href=\""+pdf+"\">PDF transcript</a>" + "\n"
    descr+="\t\t<a href=\""+audio+"\">MP3 Download</a>" + "\n"


    # get info from headers
    headers = io.BytesIO()
    c = pycurl.Curl()
    c.setopt(pycurl.MAXREDIRS, 5)
    c.setopt(pycurl.CONNECTTIMEOUT, 30)
    c.setopt(pycurl.TIMEOUT, 300)
    c.setopt(pycurl.FOLLOWLOCATION, 1)
    c.setopt(pycurl.HEADER, 1)
    c.setopt(pycurl.NOBODY, 1)
    c.setopt(pycurl.HEADERFUNCTION, headers.write)
    c.setopt(pycurl.WRITEFUNCTION, lambda x: None)
    c.setopt(pycurl.URL, audio)

    c.perform()
    heads=headers.getvalue().decode("utf-8").split("\r\n")
    date=""
    conlen=""
    for thing in heads:
        if thing.startswith("Last-Modified"):
            date=thing.removeprefix("Last-Modified:").strip()
            date=date.replace("GMT","0000")
        if thing.startswith("Content-Length"):
            conlen=thing.removeprefix("Content-Length:").strip()

    print("<item>\n")
    print("\t<title>"+title+"</title>\n")
    print("\t<itunes:summary><![CDATA["+descr+"\t]]></itunes:summary>\n")
    print("\t<guid>"+audio+"</guid>\n")
    print("\t<enclosure url=\""+audio+"\" length=\""+conlen+"\" type=\"audio/mpeg\" />\n")
    print("\t<pubDate>"+date+"</pubDate>\n")
    print("\t<itunes:author>Popup Chinese</itunes:author>\n")
    print("\t<itunes:explicit>no</itunes:explicit>\n")
    print("\t<itunes:image href=\""+audio.replace("audio.mp3","image.jpg") +"\"/>\n")

    print("</item>\n")

def boilout():
    print("</channel>\n")
    print("</rss>\n")

boilin()

for line in stdin:
    id,url,pdf,audio=line.split(",")
    doline(id,url,pdf,audio.strip())

boilout()
