import { update } from './main';

let currentProjectName = '';

function handleProjectSwitch(e) {
  const nextProjectName = e.currentTarget.innerText;
  currentProjectName = nextProjectName;
  update();
}

export { handleProjectSwitch, currentProjectName };
