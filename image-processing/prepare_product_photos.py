import sys, json, math, os
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
os.chdir(ROOT)
Path('.codex-tmp').mkdir(exist_ok=True)
sys.path.insert(0, str(Path('.codex-tmp/python').resolve()))
from PIL import Image, ImageOps, ImageDraw, ImageFilter, ImageFont
import numpy as np
import cv2
cv2.setRNGSeed(0)
import pillow_heif
pillow_heif.register_heif_opener()

# Traced outlines in percentages of the original photograph, never generated RGB.
jobs = [
 (62,'5709','bru-gold-coffee',180,True,[(36.6,22.3),(37.2,20.8),(41,20.2),(50,19.9),(60,19.8),(66.5,20.1),(68,21),(68.4,24),(68.6,37),(68.8,52),(68.8,64.2),(68.5,65.5),(68.7,67),(68.5,77.4),(67.8,79.3),(63,79.9),(51,80.1),(40,79.8),(35.8,79),(35.4,77),(35.6,67),(35.9,65.6),(35.5,63),(35.9,48),(36.1,32)]),
 (63,'5710','weikfield-cocoa-powder',180,True,[(28.8,17.5),(29.1,15.6),(32,13.8),(37.2,12.6),(44.8,12.1),(52,12.7),(59.2,14.1),(64,16.2),(67.7,19.5),(69.6,23.1),(70.7,32),(71.1,48),(71.5,65.5),(71.2,70.9),(69.9,73.7),(70.1,75.3),(69.8,81.7),(65.1,83.6),(55,84.5),(44,84.5),(34,83.5),(29.1,82),(28.9,75),(29.6,73.4),(29.3,70),(29.1,59),(28.9,40),(28.8,26)]),
 (64,'5707','queen-orange-jelly-candy',0,False,[(7.8,12.9),(85.4,13.4),(85.1,20.1),(83.7,22.8),(82.5,29.4),(82.4,37.8),(80.4,48.4),(80.8,56),(81.1,65.4),(81.7,72.5),(81.3,85.8),(75,86.8),(61,87.6),(43,87.5),(25,88.1),(10.1,87.6),(8.5,85.4),(8.1,78),(8.7,68),(9.2,58),(9.5,48),(9.7,39),(10.3,29.2),(8.6,23)]),
 (65,'5708','nescafe-classic-coffee',180,True,[(29.3,24),(30,21.9),(33.5,20.4),(43,19.7),(54.8,19.7),(63.5,20.1),(67.1,21.2),(68.4,24.5),(68.9,33),(68,41.8),(65.2,49.7),(62,54.7),(61.6,59.6),(63.1,64.6),(66.7,67.1),(67.1,69),(66.4,75.2),(64.5,77.6),(60,79.2),(53.9,80.2),(44,80.4),(35.1,79.5),(29.7,78),(27.4,75.9),(26.7,69),(27.2,67.2),(28,65.6),(29,61.9),(29.2,57.5),(28.7,52),(27.2,46.1),(26.6,39.5),(26.9,31.1)]),
 (66,'5662','dole-lavello-chocolates',0,True,[(25.2,36.4),(28.2,26.4),(35.9,17.3),(47.8,10.7),(59.8,9.6),(72.2,14.6),(80.5,24.3),(84.8,36.4),(85.3,45),(86,49.8),(85.8,61.9),(82.8,73.3),(75.3,83.3),(63.2,90.1),(49.6,90.9),(38.9,86.4),(30.1,77.5),(25.7,67.6),(24.5,62),(23.8,57),(23.6,46.1),(24.1,37.6)]),
 (67,'5661','uttam-soan-papdi',90,False,[(13.4,20.4),(81.2,23.1),(81.6,24.4),(78,27.9),(75.4,29.7),(75.2,35.8),(76.2,49.6),(76.7,64.8),(77.2,73.8),(79.2,79.3),(81,82.2),(80.3,85.2),(16.2,84.7),(16.5,82.3),(19.7,77.6),(21.1,74),(21.4,66.2),(21.2,54.3),(20.9,42.5),(20.2,34.2),(20.6,29),(17.6,26.3),(14.9,23.8)]),
 (68,'5665','weikfield-vanilla-custard-powder',0,False,[(7.8,29.7),(47.5,29.5),(48.2,31.5),(48.3,79.9),(46.7,80.4),(5.6,79.4),(5.4,77.3),(6.6,55.1)]),
 (69,'5663','maccoffee-original-50g',0,True,[(18,20.4),(23.7,20.1),(49.1,20),(76.3,20),(80.9,20.6),(81.3,22.1),(81.5,32.2),(81.7,46.1),(82.3,62.8),(82.2,76.3),(79.8,79.9),(74,81.8),(57.7,82.1),(36.3,82.3),(21.5,81.8),(16.8,79.8),(14.7,76.1),(14.8,66),(15.4,53),(15.7,39.8),(16.5,27.2)]),
 (70,'5664','hersheys-strawberry-syrup',0,True,[(21.6,17.7),(25.3,16.3),(31.4,16.2),(37.2,17),(41,18.7),(42.2,21.1),(42.3,26.3),(41.4,29.7),(39.5,31.8),(39.1,35.1),(40.6,38.6),(44.2,43.4),(47.4,48.7),(50.4,54.6),(52.1,62.5),(52.6,72.6),(52.4,80.3),(51.5,84.9),(48.9,87.2),(42,88.6),(31,89.2),(19.7,88.4),(12.9,86.9),(10.5,84.5),(9.4,79.1),(9.1,70.3),(9.9,61),(11.5,53.1),(14.6,46),(18.4,40.2),(21.6,35.1),(22.4,31.1),(21.3,29.3),(20.8,25.8),(20.8,20.6)]),
 (71,'5664','hersheys-chocolate-syrup',0,True,[(62.3,22.1),(64.3,20.1),(68.9,18.9),(75.4,18.8),(81.2,19.9),(84.1,22),(84.9,26),(84.8,29.4),(84,31.4),(84.1,35.6),(86.5,39.3),(90.7,44.2),(94.2,50),(96.4,57.4),(97.1,65.3),(96.7,74.2),(95.9,82.6),(93.7,86.7),(86.8,88.7),(76.3,89.7),(65.1,89.5),(57.9,88.2),(54.1,85.8),(53.4,81),(53.4,73.3),(53.2,65),(53.9,57.3),(55.9,49.3),(58.9,43.4),(62.2,38.9),(65.2,35.4),(65.3,32.4),(63,30.5),(62.1,27.4)]),
 (72,'5666','milk-classic-cheese-rice-crackers',0,False,[(10.8,22.5),(13.7,22.9),(17.1,24.3),(23.8,24.7),(35.1,24.1),(46.7,24.1),(49.2,25),(49.7,27.9),(50,39.8),(50.1,55.9),(50.1,70.5),(48.2,72.3),(39.4,72.4),(20.4,71.9),(4.3,71.8),(1.4,70.7),(1.8,69.1),(3.4,66.8),(4.4,64.1),(5.1,53.1),(6.2,40.4),(8.1,29.3)]),
 (73,'5666','milk-classic-milk-rice-crackers',0,False,[(52.1,24.5),(60.8,24.2),(75.6,24.7),(85.9,24.9),(91.8,24.4),(94.8,25),(95.8,29.9),(96.7,39.6),(97.3,49.9),(98.3,60.5),(99.2,70.9),(98.1,72.6),(93.8,73),(73.6,72.7),(54.8,72.3),(50.2,71.4),(50.1,58.1),(49.9,44.4),(49.7,30.2),(50.1,26)]),
]

def spline(points, steps=12):
    result=[]
    for i in range(len(points)):
        p0,p1,p2,p3=[points[j%len(points)] for j in (i-1,i,i+1,i+2)]
        for k in range(steps):
            t=k/steps; t2=t*t;t3=t2*t
            result.append(tuple(.5*((2*p1[a])+(-p0[a]+p2[a])*t+(2*p0[a]-5*p1[a]+4*p2[a]-p3[a])*t2+(-p0[a]+3*p1[a]-3*p2[a]+p3[a])*t3) for a in (0,1)))
    return result

outputs=[]
for ident,source,slug,angle,smooth,points in jobs:
    if len(sys.argv)>1 and ident not in {int(x) for x in sys.argv[1:]}:
        outputs.append({'id':ident,'source':source,'slug':slug,'path':str(Path('assets/products')/(slug+'-photo-v2.webp'))})
        continue
    image=ImageOps.exif_transpose(Image.open('assets/products/IMG_'+source+'.HEIC')).convert('RGB')
    # Limit working dimensions without changing the photographed perspective.
    image.thumbnail((1350,1800),Image.Resampling.LANCZOS)
    if ident == 65:
        # Detail trace from the upright source crop at (375,330), preserving
        # the true concave neck and curved glass rather than a generic jar shape.
        upright=[(280,31),(200,36),(150,46),(115,63),(100,75),(83,115),(70,170),(68,235),(67,240),(82,251),(80,275),(91,330),(104,390),(101,440),(76,495),(53,550),(39,600),(29,650),(20,720),(14,800),(15,885),(22,965),(35,1040),(47,1081),(67,1096),(180,1104),(330,1107),(480,1101),(550,1088),(572,1068),(589,1012),(600,940),(603,850),(600,760),(592,687),(577,609),(554,541),(532,489),(519,452),(518,414),(535,356),(557,291),(559,266),(552,251),(567,244),(563,194),(553,133),(536,91),(514,68),(470,50),(400,37),(340,31)]
        points=[((975-x)/1350*100,(1470-y)/1800*100) for x,y in upright]
    if ident == 62:
        points=[(max(x,36.5) if y>66 else x,y) for x,y in points]
    if ident == 73:
        points=[(min(x,98.1)-.8 if x>=94 else x,y) for x,y in points]
    if ident == 67:
        points=[(13.4,20.4),(81.2,23.1),(81.6,24.4),(78,27.9),(76.4,29.7),(76.5,35.8),(76.3,45),(76.2,50),(76.1,60),(75.9,65),(75.6,70),(76.1,75),(77.6,80),(79.5,84.2),(80.3,85.2),(16.2,84.7),(16.5,82.3),(19.7,77.6),(21.1,74),(21.4,66.2),(21.2,54.3),(20.9,42.5),(20.2,34.2),(20.6,29),(17.6,26.3),(14.9,23.8)]
    w,h=image.size
    mask=Image.new('L',image.size,0)
    coords=spline(points) if smooth else points
    ImageDraw.Draw(mask).polygon([(round(x*w/100),round(y*h/100)) for x,y in coords],fill=255)
    if ident not in (64,65,72,73):
        # Refine only an uncertain strip around the traced boundary. Interior
        # photograph pixels are definite foreground; far exterior is background.
        initial=np.array(mask)
        inside=cv2.distanceTransform(initial,cv2.DIST_L2,5)
        outside=cv2.distanceTransform(255-initial,cv2.DIST_L2,5)
        labels=np.where(initial>0,cv2.GC_PR_FGD,cv2.GC_PR_BGD).astype('uint8')
        labels[inside>9]=cv2.GC_FGD
        labels[outside>14]=cv2.GC_BGD
        bg=np.zeros((1,65),np.float64);fg=np.zeros((1,65),np.float64)
        cv2.grabCut(np.array(image)[:,:,::-1].copy(),labels,None,bg,fg,4,cv2.GC_INIT_WITH_MASK)
        refined=np.where((labels==cv2.GC_FGD)|(labels==cv2.GC_PR_FGD),255,0).astype('uint8')
        count,components,stats,_=cv2.connectedComponentsWithStats(refined,8)
        if count>1:
            largest=1+np.argmax(stats[1:,cv2.CC_STAT_AREA])
            refined=np.where(components==largest,255,0).astype('uint8')
        mask=Image.fromarray(refined)
    if ident in (72,73):
        mask=mask.filter(ImageFilter.MinFilter(5))
    if ident == 64:
        # Reduce opacity only in clear outer plastic. Printed artwork, sweets,
        # metallic stripes and photographic highlights retain their own pixels.
        hsv=cv2.cvtColor(np.array(image),cv2.COLOR_RGB2HSV)
        core=Image.new('L',image.size,0)
        ImageDraw.Draw(core).polygon([(int(x*w/100),int(y*h/100)) for x,y in [(22,25),(75,25),(81,33),(79,77),(70,82),(15,80),(13,69),(13,33)]],fill=255)
        alpha=np.array(mask)
        clear=(np.array(core)==0)&(alpha>0)&(hsv[:,:,1]<65)
        alpha[clear]=np.minimum(alpha[clear],105)
        shiny=clear&(hsv[:,:,2]>190)
        alpha[shiny]=np.minimum(np.array(mask)[shiny],185)
        mask=Image.fromarray(alpha)
    mask=mask.filter(ImageFilter.GaussianBlur(.55))
    cutout=image.convert('RGBA');cutout.putalpha(mask)
    cutout=cutout.crop(mask.getbbox())
    if angle:cutout=cutout.rotate(angle,expand=True)
    cutout.thumbnail((900,1100),Image.Resampling.LANCZOS)
    canvas=Image.new('RGBA',(1000,1250),(0,0,0,0))
    x=(1000-cutout.width)//2;y=(1250-cutout.height)//2-10
    shadow=Image.new('RGBA',canvas.size,(0,0,0,0));sd=ImageDraw.Draw(shadow)
    shadow_width=max(100,cutout.width*.78)
    sd.ellipse((500-shadow_width/2,y+cutout.height-12,500+shadow_width/2,y+cutout.height+18),fill=(35,24,18,43))
    shadow=shadow.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(shadow);canvas.alpha_composite(cutout,(x,y))
    output=Path('assets/products')/(slug+'-photo-v2.webp')
    canvas.save(output,'WEBP',quality=94,method=4,exact=True)
    outputs.append({'id':ident,'source':source,'slug':slug,'path':str(output)})
    print(ident,output.name,output.stat().st_size,flush=True)

Path('.codex-tmp/direct-mapping.json').write_text(json.dumps(outputs,indent=2))
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',18)
board=Image.new('RGB',(1600,1500),'#f1eee8')
for i,j in enumerate(outputs):
    im=Image.open(j['path']).convert('RGBA');im.thumbnail((385,430))
    board.paste(im,(i%4*400+(400-im.width)//2,i//4*500+20),im)
    ImageDraw.Draw(board).text((i%4*400+12,i//4*500+460),str(j['id'])+': '+j['slug'].replace('-',' ')[:34],fill='#30251c',font=font)
Path('output').mkdir(exist_ok=True)
board.save('output/original-photo-cutouts-v2.jpg',quality=95)
