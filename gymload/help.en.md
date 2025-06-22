# Gymload Calculator User Guide

Gymload is a calculator for planning progressive gym workouts. It helps automatically calculate weights for each week of a training cycle.

## Key Features

- Create multiple training programs
- Plan exercises for multiple days
- Automatic weight progression calculation for a specified number of weeks
- Support for dumbbells, barbells, and custom weights
- Progression charts
- Export programs for printing
- Track workout results

## Getting Started

### 1. Creating a Program

On first launch, you'll have one default program. To create a new one:

1. Click the "+" icon in the top panel
2. Enter the program name
3. Click "Add"

### 2. Switching Between Programs

Use the dropdown list in the top panel to switch between created programs.

### 3. Editing or Deleting a Program

Click the pencil icon next to the program dropdown to edit the name or delete the current program.

## Workout Configuration

### Basic Settings

In the "Settings" section, you can configure:

- **Week Count** - duration of the training cycle
- **Day Count** - number of training days per week
- **Show Charts** - display progression charts for each exercise
- **Progress Formula**:
  - Sigmoid - smooth weight increase with slowdown at the end
  - Logarithmic - fast start with gradual slowdown
  - Linear - uniform weight increase
- **Start Percent** - if set, initial weight will be automatically calculated as a percentage of the final weight

### Equipment Weight Configuration

In settings, you can specify available weights:

- **Dumbbell Weights** - list all available dumbbells in your gym
- **Barbell Weights** - specify barbell weights
- **Weight Plates** - list available plates

## Creating Exercises

### Adding an Exercise

1. Select a training day
2. Click the "Add Exercise" button
3. Fill in the parameters:
   - **Exercise name** - any custom name
   - **Weight type**:
     - Custom - you can set any weight and step
     - Dumbbells - weight will be rounded to available dumbbells
     - Barbell - weight will be calculated considering the bar and plates
   - **Sets** - number of sets
   - **Reps** - number of repetitions per set
   - **Begin Weight** - weight for the first week
   - **Finish Weight** - target weight for the last week
   - **Min Step** - for custom weight

### Automatic Weight Calculation

After filling in the parameters, the calculator automatically calculates weights for each week according to the selected progression formula. Weights are displayed below the exercise.

When using dumbbells or barbells, weights will be automatically rounded to what's available in the gym.

## Tracking Results

Switch to the day tab to record workout results:

1. Select the current week in the top tabs
2. Each exercise displays a set table
3. Cells show the recommended weight
4. You can enter actually performed repetitions in parentheses

## Statistics

The "Stats" section displays the total tonnage of all exercises for the entire cycle.

## Export and Print

In the "Export" section, you can:

1. View the entire program in a print-friendly format
2. Click the "Print" button to print or save as PDF

## Usage Tips

1. **Start with realistic weights** - it's better to start with less weight and successfully complete the entire cycle
2. **Use start percentage** - for example, 70% will allow you to start with 70% of the target weight
3. **Sigmoid progression** works for most cases - it provides a smooth start and finish
4. **Save results regularly** - data is stored locally in your browser
5. **Create different programs** for different goals (strength, mass, endurance)

## Keyboard Shortcuts

- Use Tab to quickly move between fields
- Enter saves changes in input fields

## Technical Features

- All data is stored locally in the browser
- The app works offline after the first load
- Mobile version is supported
- Automatic dark/light theme switching

## Source Code and Feedback

- **Source code**: https://github.com/gymload/gymload.github.io
- **Suggestions and feedback**: alexes.dev@gmail.com

## Commercial Development

The application can be customized for your brand and needs. The following options are available:

 - for personal trainers:
     - branded PDF with logo and customized client program
     - ready-made workout templates based on your methodology
     - ability to share a link to the client's program
 - for fitness clubs:
    - branded application with club logo and colors
    - weight configuration for your equipment
    - basic programs for each client

💡 The source code is open and distributed under the MIT license — your developer can customize everything independently or with my help. My contacts: alexes.dev@gmail.com.