# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# If you come from bash you might have to change your $PATH.
export PATH=$HOME/bin:/usr/local/bin:/usr/local/Cellar:$PATH
export PATH="/usr/local/opt/ruby/bin:$PATH"
export PATH="/usr/local/opt/node@10/bin:$PATH"

export TERM="xterm-256color"

# Path to your oh-my-zsh installation.
#export PATH=:/usr/local/opt/libxml2/bin:/usr/local/bin:/opt/local/bin:/opt/local/sbin:/Library/TeX/textbin:$PATH
export ZSH="$HOME/dotfiles/oh-my-zsh"

# Set name of the theme to load. Optionally, if you set this to "random"
# it'll load a random theme each time that oh-my-zsh is loaded.
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
ZSH_THEME="powerlevel10k/powerlevel10k"

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion. Case
# sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# The optional three formats: "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(git zsh-autosuggestions)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
export EDITOR=/usr/local/bin/emacs
export VISUAL=/usr/local/bin/emacs

#FORNO aliases
alias docs="cd Documents"

function sshBing(){
    if [ $# -eq 0 ] ; then
	ssh -t cforno1@remote.cs.binghamton.edu 'zsh';
    else
	ssh -t cforno1@remote0"$1".cs.binghamton.edu 'zsh';
    fi
}
alias cleanupDS="find . -type f -name '*.DS_Store' -ls -delete"
alias brewup='brew update; brew upgrade; brew cleanup; brew doctor'
#alias emacs='emacs -nw'
#More aliases
function extract() {
  if [ -f "$1" ] ; then
    local filename=$(basename "$1")
    local foldername="${filename%%.*}"
    local fullpath=`perl -e 'use Cwd "abs_path";print abs_path(shift)' "$1"`
    local didfolderexist=false
    if [ -d "$foldername" ]; then
      didfolderexist=true
      read -p "$foldername already exists, do you want to overwrite it? (y/n) " -n 1
      echo
      if [[ $REPLY =~ ^[Nn]$ ]]; then
        return
      fi
    fi
    mkdir -p "$foldername" && cd "$foldername"
    case $1 in
      *.tar.bz2) tar xjf "$fullpath" ;;
      *.tar.gz) tar xzf "$fullpath" ;;
      *.tar.xz) tar Jxvf "$fullpath" ;;
      *.tar.Z) tar xzf "$fullpath" ;;
      *.tar) tar xf "$fullpath" ;;
      *.taz) tar xzf "$fullpath" ;;
      *.tb2) tar xjf "$fullpath" ;;
      *.tbz) tar xjf "$fullpath" ;;
      *.tbz2) tar xjf "$fullpath" ;;
      *.tgz) tar xzf "$fullpath" ;;
      *.txz) tar Jxvf "$fullpath" ;;
      *.zip) unzip "$fullpath" ;;
      *) echo "'$1' cannot be extracted via extract()" && cd .. && ! $didfolderexist && rm -r "$foldername" ;;
    esac
  else
    echo "'$1' is not a valid file"
  fi
}
alias cp='cp -iv'                           # Preferred 'cp' implementation
alias mv='mv -iv'                           # Preferred 'mv' implementation
alias mkdir='mkdir -pv'                     # Preferred 'mkdir' implementation
alias ls='ls -FGlAhp'                       # Preferred 'ls' implementation
cd() { builtin cd "$@"; }               # Always list directory contents upon 'cd'
alias cd..='cd ../'                         # Go back 1 directory level (for fast typers)
alias ..='cd ../'                           # Go back 1 directory level
alias f='open -a Finder ./'                 # f:            Opens current directory in MacOS Finder
alias ~="cd ~"                              # ~:            Go Home
alias c='clear'                             # c:            Clear terminal display
mcd () { mkdir -p "$1" && cd "$1"; }        # mcd:          Makes new Dir and jumps inside
cat () {ccat "$1"}

# More Git tips http://firstaidgit.io/
alias gss="git status -s"
alias gg="git g -En"

google() {
    search=""
    echo "Googling: $@"
    for term in $@; do
        search="$search%20$term"
    done
    open "http://www.google.com/search?q=$search"
}




# POWERLINE CONFIG

POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(ssh host dir vcs background_jobs)
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(history time battery)
POWERLEVEL9K_BATTERY_LEVEL_BACKGROUND=(darkred orange4 yellow4 yellow4 chartreuse3 green3 green4 darkgreen)
POWERLEVEL9K_BACKGROUND_JOBS_VERBOSE=false
POWERLEVEL9K_BATTERY_ICON=''
POWERLEVEL9K_BATTERY_VERBOSE=false
POWERLEVEL9K_DIR_HOME_BACKGROUND='001'
POWERLEVEL9K_DIR_HOME_SUBFOLDER_BACKGROUND='001'
POWERLEVEL9K_DIR_ETC_BACKGROUND='001'
POWERLEVEL9K_HOST_LOCAL_FOREGROUND='white'
POWERLEVEL9K_TIME_BACKGROUND='black'
POWERLEVEL9K_TIME_FOREGROUND='white'
POWERLEVEL9K_VCS_CLEAN_BACKGROUND='black'
POWERLEVEL9K_VCS_CLEAN_FOREGROUND='white'
POWERLEVEL9K_VCS_UNTRACKED_FOREGROUND='yellow'
POWERLEVEL9K_VCS_UNTRACKED_BACKGROUND='black'
POWERLEVEL9K_VCS_MODIFIED_FOREGROUND='202'
POWERLEVEL9K_VCS_MODIFIED_BACKGROUND='black'
POWERLEVEL9K_ANACONDA_LEFT_DELIMITER=""
POWERLEVEL9K_ANACONDA_RIGHT_DELIMITER=""

history -cw >/dev/null 2>/dev/null



export PATH="/usr/local/sbin:$PATH"

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
