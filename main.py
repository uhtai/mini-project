# on start code
Player = SpriteKind.player
Enemy = SpriteKind.enemy
turn_angle_modifier = 9
new_obstacle_y_pos_trigger = 0
camera_offset = 0
obstacle_assets = [assets.image("rock"), assets.image("stump")]
skier = sprites.create(assets.image("skier"), Player)

def on_start():
    skier.set_position(80, 0)
    skier.vy = 100
    skier.set_flag(SpriteFlag.STAY_IN_SCREEN, True)
    skier.z = 5
    info.set_score(0)
    scene.set_background_color(1)
on_start()
# end of on start code

def clear_overlapping_sprites(sprite, other_sprite):
    other_sprite.destroy()
sprites.on_overlap(Enemy, Enemy, clear_overlapping_sprites)

def obstacle_hit(skier, obstacle):
    game.over(False)
sprites.on_overlap(Player, Enemy, obstacle_hit)

def turn(direction):
    skier.vx += direction * turn_angle_modifier
    skier.vx *= 1.02
    skier.vy *= 0.98
    if Math.abs(transformSprites.get_rotation(skier)) < 180:
        transformSprites.change_rotation(skier, (direction * -120))

def move():
    if controller.left.is_pressed():
        turn(-1)
    elif controller.right.is_pressed():
        turn(1)
    else:
        skier.vx *= 0.9
        skier.vy *= 1.01
    current_rotation = transformSprites.get_rotation(skier)
    transformSprites.rotate_sprite(skier, current_rotation * 0.8)
    scene.center_camera_at(80, skier.y + camera_offset)
    skier.vy = Math.constrain(skier.vy, 20, 150) 

def spawn_obstacle():
    obstacle = sprites.create(obstacle_assets._pick_random(), Enemy)
    obstacle.x = randint(0, 160)
    obstacle.top = scene.camera_property(CameraProperty.BOTTOM)
    obstacle.set_flag(SpriteFlag.AUTO_DESTROY, True)

def spawn_objects():
    global new_obstacle_y_pos_trigger
    if skier.y > new_obstacle_y_pos_trigger:
        new_obstacle_y_pos_trigger += randint(0, 80)
        spawn_obstacle()

def tick():
    move()
    spawn_objects()
    info.change_score_by(skier.vy / 100)
game.on_update(tick)
