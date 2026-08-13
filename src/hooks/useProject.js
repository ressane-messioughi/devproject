import { useContext } from 'react';
import ProjectContext from '../context/ProjectContext';

export default function useProject() {
  return useContext(ProjectContext);
}
