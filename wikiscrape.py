import urllib.request
from bs4 import BeautifulSoup
import json
import random

fp = urllib.request.urlopen("https://commons.wikimedia.org/wiki/Category:Photographs_by_year")
html = fp.read()
soup = BeautifulSoup(html, 'html.parser')
links = soup.find_all("a")
urls = []
for link in links:
  link = link.get("href")
  try:
    if(int(link[15:19]) >= 1958 and int(link[15:19]) <= 2020):
      urls.append("https://commons.wikimedia.org" + link)
  except:
    continue
count = 1958
to_export = {}
for url in urls:
  print(count)
  imagePage = urllib.request.urlopen(url)
  imageHtml = imagePage.read()
  imageSoup = BeautifulSoup(imageHtml, 'html.parser')
  images = imageSoup.find_all("a", {"class":"image"})
  random.shuffle(images)
  finalArr = []
  for image in images:
    if (len(finalArr) >= 100):
      break
    imageUrl = "https://commons.wikimedia.org" + image.get("href")
    final = BeautifulSoup(urllib.request.urlopen(imageUrl).read(), "html.parser").find("div",{"class":"fullImageLink"}).findChildren("img")
    for i in final:
      finalArr.append(i.get("src"))
  to_export[count] = finalArr
  count += 1

with open('images.json', 'w') as f:
    json.dump(to_export, f)