//  on start code
let Player = SpriteKind.Player
let Enemy = SpriteKind.Enemy
let Jump = SpriteKind.create()
let is_jumping = false
let distance_display = textsprite.create("", 3, 0)
let Gate = SpriteKind.create()
let turn_angle_modifier = 9
let new_obstacle_y_pos_trigger = 0
let camera_offset = 0
let obstacle_assets = [assets.image`rock`, assets.image`stump`]
let skier = sprites.create(assets.image`skier`, Player)
function on_start() {
    skier.setPosition(80, 0)
    skier.vy = 100
    skier.setFlag(SpriteFlag.StayInScreen, true)
    skier.z = 5
    info.setScore(0)
    scene.setBackgroundColor(1)
    distance_display.setFlag(SpriteFlag.RelativeToCamera, true)
    distance_display.z = 100
}

on_start()
//  end of on start code
sprites.onOverlap(Enemy, Enemy, function clear_overlapping_sprites(sprite: Sprite, other_sprite: Sprite) {
    other_sprite.destroy()
})
sprites.onOverlap(Jump, Enemy, function clear_overlapping_sprites(sprite: Sprite, other_sprite: Sprite) {
    other_sprite.destroy()
})
sprites.onOverlap(Enemy, Gate, function clear_overlapping_sprites(sprite: Sprite, other_sprite: Sprite) {
    other_sprite.destroy()
})
sprites.onOverlap(Player, Enemy, function obstacle_hit(skier: Sprite, obstacle: Sprite) {
    if (is_jumping === false) {
        game.over(false)
    }
})
sprites.onOverlap(Player, Gate, function go_through_gate(skier: Sprite, gate: Sprite) {
    if (gate.image.equals(assets.image`gate green`)) {
        return
    }
    if (spriteutils.distanceBetween(skier, gate) < 16) {
        gate.setImage(assets.image`gate green`)
        info.changeScoreBy(200)
    }
})
sprites.onOverlap(Player, Jump, function player_jump(skier: Sprite, ski_jump: Sprite) {
    is_jumping = true
    music.beamUp.play()
    while (skier.scale < 2) {
        skier.changeScale(0.04, ScaleAnchor.Middle)
        pause(20)
        info.changeScoreBy(4)
    }
    while (skier.scale > 1) {
        skier.changeScale(-0.04, ScaleAnchor.Middle)
        pause(20)
        info.changeScoreBy(4)
    }
    skier.scale = 1
    is_jumping = false
    music.knock.play()
})
function turn(direction: number) {
    skier.vx += direction * turn_angle_modifier
    skier.vx *= 1.02
    skier.vy *= 0.98
    if (Math.abs(transformSprites.getRotation(skier)) < 180) {
        transformSprites.changeRotation(skier, direction * -10)
    }
    
}

function spawn_ski_jump() {
    let ski_jump = sprites.create(assets.image`jump`, Jump)
    ski_jump.x = randint(10, 150)
    ski_jump.top = scene.cameraProperty(CameraProperty.Bottom)
    ski_jump.setFlag(SpriteFlag.AutoDestroy, true)
}

function move() {
    skier.setImage(assets.image`skier`)
    if (controller.left.isPressed()) {
        turn(-1)
    } else if (controller.right.isPressed()) {
        turn(1)
    } else {
        skier.vx *= 0.9
        skier.vy *= 1.01
    }
    
    let current_rotation = transformSprites.getRotation(skier)
    transformSprites.rotateSprite(skier, current_rotation * 0.8)
    if (controller.up.isPressed()) {
        skier.vy *= 0.98
        skier.setImage(assets.image`skier snow plough`)
    }
    scene.centerCameraAt(80, skier.y + camera_offset)
    skier.vy = Math.constrain(skier.vy, 20, 150)
}

function spawn_gate() {
    let gate = sprites.create(assets.image`gate red`, Gate)
    gate.x = randint(0, 160)
    gate.top = scene.cameraProperty(CameraProperty.Bottom)
    gate.setFlag(SpriteFlag.AutoDestroy, true)
}

function spawn_obstacle() {
    let obstacle = sprites.create(obstacle_assets._pickRandom(), Enemy)
    obstacle.x = randint(0, 160)
    obstacle.top = scene.cameraProperty(CameraProperty.Bottom)
    obstacle.setFlag(SpriteFlag.AutoDestroy, true)
}

function spawn_objects() {
    
    if (skier.y > new_obstacle_y_pos_trigger) {
        new_obstacle_y_pos_trigger += randint(0, 80)
        spawn_obstacle()
    }
    if (randint(1, 100) == 1) {
        spawn_ski_jump()
    }
    if (randint(1, 100) == 1) {
        spawn_gate()
    }
}

function update_distance_display() {
    let distance = Math.round(skier.y)
    distance_display.setText(distance.toString() + "m")
    distance_display.top = 0
    distance_display.left = 0
}

game.onUpdate(function tick() {
    move()
    spawn_objects()
    info.changeScoreBy(skier.vy / 100)
    update_distance_display()
})
