import arcade

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
PLAYER_SPEED = 5
PLAYER_JUMP_SPEED = 12
GRAVITY = 1
GROUND_HEIGHT = 50

class MarioGame(arcade.Window):
    def __init__(self, width, height, title):
        super().__init__(width, height, title)
        self.set_mouse_visible(False)
        self.player = None
        self.platforms = None
        self.coins = None

    def setup(self):
        self.player = arcade.Sprite("mario.jpeg", center_x=50, center_y=GROUND_HEIGHT + 30, scale=0.5)
        self.player.change_x = 0
        self.player.change_y = 0

        self.platforms = arcade.SpriteList()
        self.coins = arcade.SpriteList()

        # Create ground platform
        ground = arcade.create_rectangle_filled(SCREEN_WIDTH // 2, GROUND_HEIGHT // 2, SCREEN_WIDTH, 20, arcade.color.GREEN)
        self.platforms.append(ground)

        # Create some platforms
        platform1 = arcade.create_rectangle_filled(200, 150, 100, 20, arcade.color.GREEN)
        platform2 = arcade.create_rectangle_filled(500, 300, 100, 20, arcade.color.GREEN)
        self.platforms.extend([platform1, platform2])

        # Create some coins
        coin1 = arcade.Sprite("coin.jpeg", center_x=250, center_y=200, scale=0.5)
        coin2 = arcade.Sprite("coin.jpeg", center_x=600, center_y=350, scale=0.5)
        self.coins.extend([coin1, coin2])

    def on_draw(self):
        arcade.start_render()
        self.player.draw()
        self.platforms.draw()
        self.coins.draw()

    def on_key_press(self, key, modifiers):
        if key == arcade.key.RIGHT:
            self.player.change_x = PLAYER_SPEED
        elif key == arcade.key.LEFT:
            self.player.change_x = -PLAYER_SPEED
        elif key == arcade.key.SPACE and self.player.bottom == GROUND_HEIGHT:
            self.player.change_y = PLAYER_JUMP_SPEED

    def on_key_release(self, key, modifiers):
        if key == arcade.key.RIGHT or key == arcade.key.LEFT:
            self.player.change_x = 0

    def on_update(self, delta_time):
        self.player.update()

        # Check for collisions with platforms
        hit_list = arcade.check_for_collision_with_list(self.player, self.platforms)
        if not hit_list and self.player.bottom > GROUND_HEIGHT:
            self.player.change_y -= GRAVITY
        else:
            self.player.change_y = 0
            self.player.bottom = max(GROUND_HEIGHT, min(platform.top + self.player.height / 2 for platform in hit_list))

        # Check for collisions with coins
        coin_hit_list = arcade.check_for_collision_with_list(self.player, self.coins)
        for coin in coin_hit_list:
            coin.remove_from_sprite_lists()
            # You can add scoring logic here

def main():
    game = MarioGame(SCREEN_WIDTH, SCREEN_HEIGHT, "Simple Mario-like Game")
    game.setup()
    arcade.run()

if __name__ == "__main__":
    main()
