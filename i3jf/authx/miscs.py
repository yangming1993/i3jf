#!/usr/bin/python
#build by evan
#-*- coding=utf-8 -*-
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
from i3jf.settings import BASE_DIR

_letter_cases = "abcdefghjkmnpqrstuvwxy"
_upper_cases = _letter_cases.upper()
_numbers = ''.join(map(str, range(3, 10)))
init_chars = ''.join((_letter_cases, _upper_cases, _numbers))


class CaptchaGenerator():
    def __init__(self ):
        self.font_type = os.path.join( BASE_DIR,'authx/font/Vera.ttf' )
        self.chars = init_chars
        self.img_type = "JPG"
        self.mode = "RGBA"
        self.bg_color = (255, 255, 255)
        self.font_size = (28, 33)
        self.length = 4
        self.n_line = (3, 6)
        self.point_chance = 2
        self.size = (180, 50)
    def get_chars(self):
        return random.sample(self.chars, self.length)

    def create_points(self, draw, width, height):
        for w in xrange(width):
            for h in xrange(height):
                tmp = random.randint(0, 100)
                if tmp < self.point_chance:
                  font = ImageFont.truetype(self.font_type, 30)
                  draw.text((w, h), "*", font=font, fill=(random.randint(200,255),random.randint(200,255),random.randint(200,255)))

    def create_strs(self, draw):
        c_chars = self.get_chars()
        for i in xrange(self.length):
            font = ImageFont.truetype(self.font_type, random.randint(*self.font_size))
            c = c_chars[i]
            draw.text((random.randint(35,50)*i, random.randint(0,6)), c,
                      font=font, fill=(random.randint(0,156),random.randint(0,156),random.randint(0,156)))

        return ''.join(c_chars)

    def create_lines(self, draw):
        line_num = random.randint(*self.n_line)
        for i in range(line_num):
            begin = (random.randint(0, self.size[0]), random.randint(0, self.size[1]))

            end = (random.randint(2, self.size[0]), random.randint(2, self.size[1]))
            draw.line([begin, end], fill=(random.randint(0,156),random.randint(0,156),random.randint(0,156)), width=random.randint(1,4))

    def Generate(self):
        bg_color=(random.randint(157,255), random.randint(157,255), random.randint(157,255))

        width, height = self.size
        img = Image.new(self.mode, self.size, bg_color)
        draw = ImageDraw.Draw(img)
        self.create_points(draw, width,height)
        self.create_lines(draw)
        strs = self.create_strs(draw)
        return img, strs

gCaptchaGenerator = CaptchaGenerator()

