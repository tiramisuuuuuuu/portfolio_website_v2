import { FaGithub, FaLinkedin } from 'react-icons/fa';
import styles from './ProjectsSection.module.css';
import { projects } from './portfolio-content';
import { IoIosLink } from 'react-icons/io';

export default function ProjectsSection() {
  const colors = ['#FFB86F', '#E0CA3C', '#BA5C12'];

  return (
    <div className={styles.container}>
      {Object.entries(projects).map(([key, obj], idx) => (
        <div key={key} className={styles.projectDiv}>
          <p className={styles.desc}>
            <span
              style={{ color: colors[idx % colors.length] }}
            >{`${key}:`}</span>{' '}
            {obj.desc}
          </p>
          <div className={styles.skillsDiv}>
            {obj.skills.map((skill) => (
              <p key={`${key}-${skill}`} className={styles.skill}>
                {skill}
              </p>
            ))}
          </div>
          {Object.entries(obj.links).map(([linkKey, url]) => (
            <a key={linkKey} href={url} target="_blank">
              {linkKey === 'Github' ? (
                <FaGithub size={30} />
              ) : linkKey === 'Linkedin' ? (
                <FaLinkedin size={30} />
              ) : (
                <IoIosLink size={30} />
              )}
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
