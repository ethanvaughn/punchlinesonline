# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:$HOME/.local/bin:/usr/local/bin:$PATH

# Path to your Oh My Zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time Oh My Zsh is loaded, in which case, to know
# which specific one was loaded, run: echo $RANDOM_THEME
ZSH_THEME="bira"

# Which plugins would you like to load?
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)

source $ZSH/oh-my-zsh.sh

# Disable Oh My Zsh update prompts in the development container.
zstyle ':omz:update' mode disabled