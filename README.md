# Pixel Football - Retro-Style 2D Football Game

## Overview

Pixel Football is a nostalgic, retro-inspired 2D football game featuring pixel art graphics, physics-based gameplay, and classic arcade-style mechanics. Built with modern game development techniques, this project combines the charm of vintage 8-bit and 16-bit sports games with smooth physics simulation, collision detection, and engaging gameplay that captures the essence of classic football arcade games.

## Purpose

This project was developed as part of the Game Programming course at John Abbott College to demonstrate proficiency in 2D game development, physics simulation, sprite animation, game loop implementation, and player input handling. The goal was to create an entertaining, fully playable game that showcases both technical skills and creative game design.

## Key Features

### Gameplay Mechanics

- **Player Control**: Smooth keyboard/gamepad controls for running, passing, and shooting
- **Ball Physics**: Realistic ball movement with gravity, friction, and bounce
- **AI Opponents**: Computer-controlled players with varying difficulty levels
- **Scoring System**: Points for goals, assists, and defensive plays
- **Power-ups**: Special abilities and temporary boosts
- **Tackle System**: Physical contact and ball possession mechanics
- **Weather Effects**: Rain, snow, and wind affecting gameplay

### Game Modes

- **Quick Match**: Single game against AI
- **Tournament Mode**: Multi-match championship
- **Penalty Shootout**: Classic penalty kick competition
- **Practice Mode**: Free play to improve skills
- **Two-Player Mode**: Local multiplayer head-to-head
- **Career Mode**: Season progression with team management

### Visual & Audio

- **Pixel Art Graphics**: Hand-crafted retro sprites and animations
- **Animated Sprites**: Character movement, celebrations, and reactions
- **Particle Effects**: Goal explosions, confetti, and impact effects
- **Chiptune Music**: 8-bit style background music
- **Sound Effects**: Kick, whistle, crowd cheers, and ambient sounds
- **Dynamic Camera**: Follows the action smoothly

### Technical Features

- **Physics Engine**: Custom 2D physics for ball and player movement
- **Collision Detection**: Precise hitboxes for players, ball, and goalposts
- **State Machine**: AI behavior patterns and game state management
- **Score Tracking**: Real-time statistics and match replay
- **Save System**: Progress persistence and settings storage
- **Customization**: Team colors, player names, and difficulty settings

## Technologies Used

### Core Development

- **Game Engine**: Unity / Godot / Custom Engine (specify which you used)
- **Programming Language**: C# (Unity) / Python (Pygame) / JavaScript (Phaser)
- **Graphics**: Aseprite / Photoshop for pixel art creation
- **Physics**: Box2D / Custom physics implementation
- **Audio**: BFXR / ChipTone for sound effects

### Game Development Tools

- **Sprite Editor**: Aseprite for pixel art and animations
- **Tilemap Editor**: Tiled for level design
- **Animation**: Frame-by-frame sprite animation
- **Collision System**: AABB (Axis-Aligned Bounding Box) detection
- **Input Manager**: Keyboard and gamepad support

### Asset Creation

- **Pixel Art**: 16x16 and 32x32 sprite tiles
- **Sprite Sheets**: Organized animation frames
- **Sound Design**: 8-bit synthesized audio
- **Music Composition**: Chiptune tracker software

## Installation & Setup

### Prerequisites

```bash
# If using Unity:
Unity 2021.3 LTS or newer

# If using Pygame:
Python 3.8+
pip install pygame

# If using Phaser:
Node.js 14+
npm install phaser
```

### Running the Game

#### Unity Version

```bash
# Clone the repository
git clone https://github.com/BalpreetSingh-code/Pixel-Football.git

# Open in Unity
# File > Open Project > Select Pixel-Football folder

# Press Play button or Ctrl+P to run
```

#### Python/Pygame Version

```bash
# Clone the repository
git clone https://github.com/BalpreetSingh-code/Pixel-Football.git

# Navigate to directory
cd Pixel-Football

# Install dependencies
pip install -r requirements.txt

# Run the game
python main.py
```

#### JavaScript/Phaser Version

```bash
# Clone the repository
git clone https://github.com/BalpreetSingh-code/Pixel-Football.git

# Install dependencies
npm install

# Run development server
npm start

# Open in browser
# http://localhost:8080
```

## Project Structure

```
pixel-football/
├── assets/
│   ├── sprites/
│   │   ├── players/           # Player sprite sheets
│   │   ├── ball/              # Ball animations
│   │   ├── field/             # Stadium and grass tiles
│   │   └── ui/                # Menu and HUD elements
│   ├── sounds/
│   │   ├── sfx/               # Sound effects
│   │   └── music/             # Background music
│   └── fonts/                 # Pixel fonts
│
├── scripts/
│   ├── game/
│   │   ├── GameManager.cs     # Main game controller
│   │   ├── Player.cs          # Player movement & actions
│   │   ├── Ball.cs            # Ball physics
│   │   ├── AIController.cs    # Computer opponent
│   │   └── ScoreManager.cs    # Scoring system
│   ├── physics/
│   │   ├── PhysicsEngine.cs   # Custom physics
│   │   ├── Collision.cs       # Collision detection
│   │   └── Vector2D.cs        # Math utilities
│   ├── ui/
│   │   ├── MenuManager.cs     # Menu system
│   │   ├── HUD.cs             # In-game interface
│   │   └── PauseMenu.cs       # Pause functionality
│   └── utilities/
│       ├── InputManager.cs    # Input handling
│       └── SaveSystem.cs      # Save/load data
│
├── scenes/
│   ├── MainMenu.unity         # Title screen
│   ├── GameScene.unity        # Main gameplay
│   └── EndGame.unity          # Results screen
│
└── README.md
```

## Game Physics Implementation

### Ball Physics

```csharp
public class Ball : MonoBehaviour
{
    public Vector2 velocity;
    public float gravity = -9.8f;
    public float friction = 0.98f;
    public float bounciness = 0.7f;

    void Update()
    {
        // Apply gravity
        velocity.y += gravity * Time.deltaTime;

        // Apply friction
        velocity *= friction;

        // Update position
        transform.position += (Vector3)velocity * Time.deltaTime;

        // Ground collision
        if (transform.position.y <= 0)
        {
            transform.position = new Vector3(
                transform.position.x,
                0,
                transform.position.z
            );
            velocity.y *= -bounciness;
        }
    }

    public void Kick(Vector2 direction, float power)
    {
        velocity = direction.normalized * power;
    }
}
```

### Player Movement

```csharp
public class Player : MonoBehaviour
{
    public float speed = 5f;
    public float sprintMultiplier = 1.5f;
    public float acceleration = 0.2f;

    private Vector2 targetVelocity;
    private Vector2 currentVelocity;

    void Update()
    {
        // Get input
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");
        bool sprinting = Input.GetKey(KeyCode.LeftShift);

        // Calculate target velocity
        targetVelocity = new Vector2(horizontal, vertical).normalized;
        targetVelocity *= speed * (sprinting ? sprintMultiplier : 1f);

        // Smooth acceleration
        currentVelocity = Vector2.Lerp(
            currentVelocity,
            targetVelocity,
            acceleration
        );

        // Move player
        transform.position += (Vector3)currentVelocity * Time.deltaTime;

        // Update animation
        UpdateAnimation();
    }
}
```

### Collision Detection

```csharp
public class CollisionSystem
{
    public static bool CheckAABB(GameObject obj1, GameObject obj2)
    {
        Bounds bounds1 = obj1.GetComponent<SpriteRenderer>().bounds;
        Bounds bounds2 = obj2.GetComponent<SpriteRenderer>().bounds;

        return bounds1.Intersects(bounds2);
    }

    public static bool CheckCircle(Vector2 pos1, float radius1,
                                   Vector2 pos2, float radius2)
    {
        float distance = Vector2.Distance(pos1, pos2);
        return distance < (radius1 + radius2);
    }
}
```

## AI Implementation

### Basic AI Controller

```csharp
public class AIController : MonoBehaviour
{
    public enum AIState
    {
        Idle,
        ChaseBall,
        DefendGoal,
        AttackGoal,
        Tackle
    }

    private AIState currentState;
    private Ball ball;
    private Vector3 targetPosition;

    void Update()
    {
        DetermineState();
        ExecuteState();
    }

    void DetermineState()
    {
        float distanceToBall = Vector3.Distance(transform.position, ball.transform.position);

        if (distanceToBall < 2f)
        {
            currentState = AIState.Tackle;
        }
        else if (ball.transform.position.x < 0) // Ball in defending half
        {
            currentState = AIState.DefendGoal;
        }
        else
        {
            currentState = AIState.ChaseBall;
        }
    }

    void ExecuteState()
    {
        switch (currentState)
        {
            case AIState.ChaseBall:
                MoveTowards(ball.transform.position);
                break;

            case AIState.DefendGoal:
                Vector3 defensivePosition = CalculateDefensivePosition();
                MoveTowards(defensivePosition);
                break;

            case AIState.Tackle:
                AttemptTackle();
                break;
        }
    }
}
```

## Sprite Animation System

### Animation Controller

```csharp
public class SpriteAnimator : MonoBehaviour
{
    public Sprite[] idleFrames;
    public Sprite[] runFrames;
    public Sprite[] kickFrames;

    private SpriteRenderer spriteRenderer;
    private int currentFrame = 0;
    private float frameTimer = 0f;
    public float frameRate = 0.1f;

    void Update()
    {
        frameTimer += Time.deltaTime;

        if (frameTimer >= frameRate)
        {
            frameTimer = 0f;
            currentFrame = (currentFrame + 1) % GetCurrentFrames().Length;
            spriteRenderer.sprite = GetCurrentFrames()[currentFrame];
        }
    }

    Sprite[] GetCurrentFrames()
    {
        if (IsKicking())
            return kickFrames;
        else if (IsRunning())
            return runFrames;
        else
            return idleFrames;
    }
}
```

## Game State Management

### State Machine

```csharp
public class GameManager : MonoBehaviour
{
    public enum GameState
    {
        Menu,
        Kickoff,
        Playing,
        Goal,
        HalfTime,
        FullTime,
        Paused
    }

    public GameState currentState;

    void Update()
    {
        switch (currentState)
        {
            case GameState.Menu:
                HandleMenu();
                break;

            case GameState.Playing:
                HandleGameplay();
                CheckGoal();
                break;

            case GameState.Goal:
                HandleGoalCelebration();
                break;

            case GameState.Paused:
                HandlePause();
                break;
        }
    }

    public void ChangeState(GameState newState)
    {
        // Exit current state
        ExitState(currentState);

        // Enter new state
        currentState = newState;
        EnterState(newState);
    }
}
```

## Scoring System

### Score Manager

```csharp
public class ScoreManager : MonoBehaviour
{
    public int homeScore = 0;
    public int awayScore = 0;
    public float matchTime = 0f;
    public float halfDuration = 180f; // 3 minutes per half

    public void AddGoal(bool isHomeTeam)
    {
        if (isHomeTeam)
            homeScore++;
        else
            awayScore++;

        ShowGoalAnimation();
        PlayGoalSound();
        ResetBall();
    }

    void Update()
    {
        matchTime += Time.deltaTime;

        if (matchTime >= halfDuration && !isSecondHalf)
        {
            EndHalf();
        }
        else if (matchTime >= halfDuration * 2)
        {
            EndMatch();
        }
    }
}
```

## Particle Effects

### Goal Celebration

```csharp
public class ParticleManager : MonoBehaviour
{
    public GameObject confettiPrefab;
    public GameObject explosionPrefab;

    public void TriggerGoalCelebration(Vector3 position)
    {
        // Spawn confetti
        GameObject confetti = Instantiate(
            confettiPrefab,
            position,
            Quaternion.identity
        );

        // Spawn explosion
        GameObject explosion = Instantiate(
            explosionPrefab,
            position,
            Quaternion.identity
        );

        // Play sound
        AudioManager.Instance.PlaySound("goal");

        // Shake camera
        CameraShake.Instance.Shake(0.5f, 0.3f);
    }
}
```

## Controls

### Keyboard Controls

```
Movement:
- Arrow Keys / WASD: Move player
- Shift: Sprint
- Space: Kick/Pass
- Z: Switch player (defensive)
- X: Tackle

Menu:
- Enter: Select
- Escape: Pause/Back
```

### Gamepad Support

```
- Left Stick: Movement
- A/X: Kick/Pass
- B/Circle: Sprint
- Y/Triangle: Switch player
- Start: Pause
```

## Learning Outcomes

### Game Development

- **Game Loop**: Understanding update cycles and fixed timesteps
- **Physics Simulation**: Implementing realistic movement and collisions
- **Sprite Animation**: Frame-based character animation
- **State Machines**: Managing game states and AI behavior
- **Input Handling**: Responsive player controls

### Programming Concepts

- **Object-Oriented Design**: Component-based architecture
- **Vectors & Math**: 2D math for movement and physics
- **Collision Detection**: AABB and circle collision algorithms
- **Performance Optimization**: Efficient rendering and updates
- **Event Systems**: Decoupled communication between objects

### Game Design

- **Player Feedback**: Visual and audio cues for actions
- **Game Balance**: Tuning difficulty and AI behavior
- **User Experience**: Intuitive controls and interface
- **Level Design**: Creating engaging play spaces
- **Progression Systems**: Rewarding player improvement

## Pixel Art Creation

### Sprite Design Process

1. **Concept Sketching**: Planning character poses
2. **Base Sprite**: Creating 16x16 or 32x32 base
3. **Animation Frames**: Drawing movement cycles
4. **Color Palette**: Limited retro color scheme
5. **Export**: Organizing sprite sheets

### Color Palette

```
Field Green:  #2ECC40
Dark Green:   #1E8930
White:        #FFFFFF
Black:        #111111
Team Red:     #FF4136
Team Blue:    #0074D9
Ball White:   #F0F0F0
```

## Audio Design

### Sound Effects

- **Kick**: Whoosh sound with impact
- **Whistle**: Referee signals
- **Crowd**: Ambient stadium noise
- **Goal**: Celebration cheer
- **Collision**: Player contact sound

### Music

- 8-bit chiptune compositions
- Menu theme: Upbeat and energetic
- Gameplay theme: Fast-paced and exciting
- Victory theme: Triumphant fanfare

## Challenges & Solutions

### Challenge 1: Ball Control

**Problem**: Ball physics feeling too floaty
**Solution**: Adjusted gravity, friction, and implemented ball magnetism near players

### Challenge 2: AI Pathfinding

**Problem**: AI players getting stuck
**Solution**: Implemented simplified navigation with obstacle avoidance

### Challenge 3: Collision Precision

**Problem**: Ball passing through goals
**Solution**: Added continuous collision detection for fast-moving objects

## Future Enhancements

### Planned Features

- [ ] Online multiplayer mode
- [ ] Team customization editor
- [ ] More game modes (hockey, basketball variations)
- [ ] Achievement system
- [ ] Replay system with slow-motion
- [ ] Weather effects (rain, snow, wind)
- [ ] Stadium editor
- [ ] Mobile touch controls
- [ ] Leaderboards and statistics tracking

### Technical Improvements

- [ ] Shader effects for retro CRT look
- [ ] More sophisticated AI with machine learning
- [ ] Procedural animation blending
- [ ] Advanced particle systems
- [ ] Localization support

## Performance Optimization

- **Object Pooling**: Reusing game objects
- **Sprite Batching**: Reducing draw calls
- **Culling**: Not rendering off-screen objects
- **Fixed Update**: Physics in consistent timestep
- **Asset Optimization**: Compressed sprites and audio

## Testing

### Playtesting Focus Areas

- Control responsiveness
- AI difficulty balance
- Game pacing and match duration
- Visual clarity of gameplay elements
- Audio feedback effectiveness

## Credits & Acknowledgments

### Inspiration

- Sensible Soccer (Amiga)
- Tecmo Bowl (NES)
- Super Sidekicks (Neo Geo)
- Retro arcade sports games

### Tools & Resources

- Aseprite for pixel art
- BFXR for sound effects
- OpenGameArt.org for reference
- Game development tutorials

### Educational Institution

John Abbott College - Game Programming Course

## Contributing

Feedback and suggestions welcome via GitHub issues!

## License

Educational project for academic purposes.

## Contact

**Developer**: Balpreet Singh Sahota  
**Institution**: John Abbott College - Computer Science  
**Course**: Game Programming  
**GitHub**: [@BalpreetSingh-code](https://github.com/BalpreetSingh-code)  
**Email**: sahotabalpreetsingh1@gmail.com

**Repository**: https://github.com/BalpreetSingh-code/Pixel-Football

---

_Score goals in retro style | Built with pixel-perfect precision_
