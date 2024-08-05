# Swipe-Button-Card

![readme-images-swipe-button-card](https://github.com/Nemuritor01/swipe-button-card/blob/main/.github/swipe-button-card.gif)

Swipe-Button-Card is a minimalist and customizable card, that lets you toggle 3 buttons with swipe gestures.
It acts like a container for 3 card (which can be any Home Assistant card), while swiping to the left, right (or top bottom)
triggers a click on the specific sub-button.
This card is written in CSS and Java Script and not using any third party library.

Please note, that I´ve created this card for my personal use in the first place.
I´m not a full time developer, but an IT guy.
The code might not follow best practise methods. Contributors are welcome.

<br>

## Table of contents

**[`Installation`](#installation)**  **[`Configuration`](#configuration)**  **[`Styling`](#styling)**

<br>

## Installation

**Home Assistant lowest supported version:** 2023.9.0

<details>

<summary>With HACS</summary>

<br>

1. Open HACS (installation instructions are [here](https://hacs.xyz/docs/setup/prerequisites/).
2. Open the menu in the upper-right and select `Custom repositories`.
3. Enter the repository: `https://github.com/Nemuritor01/swipe-button-card`
4. Select the category `Lovelace`.
5. Select `ADD`.
6. Confirm the repository now appears in your HACS custom repositories list. Select `CANCEL` to close the custom repository window.
7. In the HACS search, type `Swipe-Button-Card`.
8. Select the `CSS-Swipe-Card` Respository from the list.
9. Install the Repository.
10. Make sure to add to resources via one of the following:
    - If using the GUI Resource option, this should have been added automatically.
    - If using the `configuration.yaml`, open your `configuration.yaml` via File editor or other means and add:
      ```
      lovelace:
        mode: yaml
        resources:
          - url: /hacsfiles/swipe-Button-card/swipe-Button-card.js
            type: module
      ```
11. Reload your browser. If the card does not show, try to clear your browser cache.

</details>

<details>

<summary>Without HACS</summary>

<br>

1. Download these files: [css-swipe-card.js](https://github.com/Nemuritor01/swipe-button-card/blob/main/dist/swipe-button-card.js)
2. Add these files to your `<config>/www` folder
3. On your dashboard click on the icon at the right top corner then on `Edit dashboard`
4. Click again on that icon and then click on `Manage resources`
5. Click on `Add resource`
6. Copy and paste this: `/local/swipe-button-card.js?v=1`
7. Click on `JavaScript Module` then `Create`
8. Go back and refresh your page
9. After any update of the file you will have to edit `/local/swipe-button-card.js?v=1` and change the version to any higher number

If it's not working, just try to clear your browser cache.`

</details>

## Configuration:

Add a card with type `custom:swipe-button-card`:

```yaml
- type: custom:css-swipe-card
  card_1: []
  swipe_card:
  card_2:
```
## Parameters

| Name | Type | Default | Supported options | Description |
| ---- | ---- | ------- | ----------------- | ----------- |
| `template` | string | swipe-button-horizontal | swipe-button-horizontal, sswipe-button-vertical | vertical or horizontal swipe-button |
| `layout` | number | 3 | 1 , 2 , 3 | defines the amount of cards |
| `width` | string | 100% | Any css option that fits in the `width` css value | Will force the width of the swiper container |
| `height` | string | 100% | Any css option that fits in the `height` css value | Will force the height of the swiper container |
| `auto_height` | boolean | false | true, false | force the same heigth, based on the tallest card (horizontal mode only!)|
| `custom_css` | | none | see [`Styling`](#styling) | customize design of the swipe card based on various shortcuts |

## Styles

Option `custom_css:`gives the ability to customize lots of css variables

| Variable | Default |
| -------- | ------- |
| `--card-1-bg` | transparent |
| `--card-1-border-radius` | var(--ha-card-border-radius) |
| `--swipe-bg` | transparent |
| `--swipe-border-radius` | var(--ha-card-border-radius) |
| `--card-2-bg` | transparent |
| `--card-2-border-radius` | var(--ha-card-border-radius) |
| `--swipe-container-bg` | transparent |
| `--swipe-container-border-radius` | var(--ha-card-border-radius) |



Example code

```yaml
type: custom:swipe-button-card
auto_height: true
layout: 3
height: 66px
card_1:
  type: custom:button-card
  icon: mdi:test-tube
  name: Test1
  entity: switch.your_switch1
  show_name: false
  styles:
    card:
      - height: 66px
      - width: 66px
      - border-radius: 100%
      - background: orchid
swipe_card:
  type: custom:button-card
  name: swipe me to the left or right
  entity: switch.your_switch2
  icon: mdi:gesture-swipe
  styles:
    grid:
      - grid-template-areas: '''i n'''
      - grid-template-columns: min-content 1fr
    card:
      - height: 100%
      - border-radius: 24px
      - padding: 0.5rem
    name:
      - justify-self: center
      - color: purple
    img_cell:
      - width: 50px
      - height: 50px
      - background: rgba(0,0,0,0.30)
      - border-radius: 100%
    icon:
      - color: purple
card_2:
  type: custom:button-card
  icon: mdi:test-tube-off
  name: Test2
  entity: switch.your_switch2
  show_name: false
  styles:
    card:
      - height: 66px
      - width: 66px
      - border-radius: 100%
      - background: cornflowerblue
custom_css:
  '--card-1-bg': transparent
  '--card-1-border-radius': 24px
  '--swipe-bg': transparent
  '--swipe-border-radius': 24px
  '--card-2-bg': transparent
  '--card-2-border-radius': 24px

```

