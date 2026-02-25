import pyautogui
import time


CENTER_X = 1260

CENTER_Y = 1043

RADIUS = 3



def is_red(pixel):

    r, g, b = pixel

    return r > 200 and g < 80 and b < 80   # mostly red



time.sleep(3)



while True:

    found_red = False



    for dx in range(-RADIUS, RADIUS + 1):

        for dy in range(-RADIUS, RADIUS + 1):

            color = pyautogui.pixel(CENTER_X + dx, CENTER_Y + dy)



            if is_red(color):

                found_red = True

                break

        if found_red:

            break



    if found_red:

        pyautogui.scroll(-1)

        time.sleep(1.5)