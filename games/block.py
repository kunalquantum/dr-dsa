import pygame
import random
import math

# Initialize Pygame
pygame.init()

# Constants
WIDTH = 800
HEIGHT = 600
PLAYER_SIZE = (50, 50)
BLOCK_SIZE = (50, 50)
PLAYER_SPEED = 0.5
BLOCK_SPEED = 0.1
MAX_BLOCKS = 5  # Maximum number of blocks on the screen
QUESTION_INTERVAL = 300000000  # Milliseconds
FONT_SIZE = 24
QUESTION_FONT_COLOR = (255, 255, 0)
ANSWER_FONT_COLOR = (0, 255, 0)
WRONG_ANSWER_FONT_COLOR = (255, 0, 0)

# Set up the screen
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Data Structure Quiz")

# Load images
player_img = pygame.image.load('s.png').convert_alpha()
block_img1 = pygame.image.load('1.png').convert_alpha()  # Option 1
block_img2 = pygame.image.load('2.png').convert_alpha()  # Option 2
block_img3 = pygame.image.load('3.png').convert_alpha()  # Option 3
background_img = pygame.image.load('back4.jpg').convert()

# Scale images
player_img = pygame.transform.scale(player_img, PLAYER_SIZE)
block_img1 = pygame.transform.scale(block_img1, BLOCK_SIZE)
block_img2 = pygame.transform.scale(block_img2, BLOCK_SIZE)
block_img3 = pygame.transform.scale(block_img3, BLOCK_SIZE)
background_img = pygame.transform.scale(background_img, (WIDTH, HEIGHT))

# Font
font = pygame.font.Font(None, FONT_SIZE)

# Player
player_pos = [WIDTH // 2, HEIGHT - PLAYER_SIZE[1]]

# Blocks
blocks = []

# Questions
questions = [
    {"question": "What data structure uses FIFO (First In, First Out) ordering?", "options": ["queue", "stack", "tree"], "answer": "queue"},
    {"question": "What data structure uses LIFO (Last In, First Out) ordering?", "options": ["stack", "queue", "dictionary"], "answer": "stack"},
    {"question": "What data structure uses key-value pairs?", "options": ["dictionary", "queue", "sorted list"], "answer": "dictionary"},
    {"question": "What data structure organizes items in a sorted order?", "options": ["sorted list", "dictionary", "stack"], "answer": "sorted list"},
    {"question": "What data structure organizes items based on a parent-child relationship?", "options": ["tree", "stack", "queue"], "answer": "tree"}
]

current_question = None
question_timer = 0
block_counter = 0  # Counter to keep track of the number of blocks spawned
score = 0

# Functions
def distance(point1, point2):
    return math.sqrt((point2[0] - point1[0]) ** 2 + (point2[1] - point1[1]) ** 2)

def generate_question():
    return random.choice(questions)

def draw_text(text, color, position):
    text_surface = font.render(text, True, color)
    screen.blit(text_surface, position)

# Game loop
running = True
while running:
    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Move player
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player_pos[0] -= PLAYER_SPEED
    if keys[pygame.K_RIGHT]:
        player_pos[0] += PLAYER_SPEED

    # Spawn blocks
    if current_question is not None and block_counter < MAX_BLOCKS and random.randint(0, 100) < 5:
        block_pos = [random.randint(BLOCK_SIZE[0], WIDTH - BLOCK_SIZE[0]), -BLOCK_SIZE[1]]
        question_index = random.randint(0, len(current_question["options"]) - 1)
        if question_index == 0:
            block_img = block_img1
        elif question_index == 1:
            block_img = block_img2
        else:
            block_img = block_img3
        blocks.append((block_pos, block_img, current_question["options"][question_index]))
        block_counter += 1

    # Move blocks
    for block_data in blocks:
        block_pos, _, _ = block_data
        block_pos[1] += BLOCK_SPEED
        if block_pos[1] > HEIGHT + BLOCK_SIZE[1]:
            blocks.remove(block_data)
            block_counter -= 1

    # Collision detection
    for block_data in blocks:
        block_pos, _, option = block_data
        if distance(player_pos, block_pos) < max(PLAYER_SIZE[0], PLAYER_SIZE[1]) / 2 + max(BLOCK_SIZE[0], BLOCK_SIZE[1]) / 2:
            if current_question["answer"] == option:
                score += 1
            else:
                score -= 1
            blocks.remove(block_data)
            block_counter -= 1
            current_question = generate_question()
            question_timer = pygame.time.get_ticks()
            break  # Exit the loop after the first collision

    # Generate question
    if current_question is None or pygame.time.get_ticks() - question_timer > QUESTION_INTERVAL:
        current_question = generate_question()
        question_timer = pygame.time.get_ticks()

    # Clear the screen
    screen.blit(background_img, (0, 0))

    # Draw player
    screen.blit(player_img, player_pos)

    # Draw blocks
    for block_data in blocks:
        block_pos, block_img, _ = block_data
        screen.blit(block_img, block_pos)

    # Draw question
    if current_question is not None:
        draw_text(current_question["question"], QUESTION_FONT_COLOR, (10, 10))
        options_y = 40
        for option in current_question["options"]:
            draw_text(option, QUESTION_FONT_COLOR, (10, options_y))
            options_y += FONT_SIZE + 5

    # Draw score
    score_text = f"Score: {score}"
    draw_text(score_text, QUESTION_FONT_COLOR, (WIDTH - len(score_text) * 8, 10))

    # Update the display
    pygame.display.flip()

# Quit Pygame
pygame.quit()
