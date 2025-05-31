package realfilllykung.cloudflare.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import realfilllykung.cloudflare.backend.model.Credential;

public interface ICredentialRepository extends JpaRepository<Credential, Long> {
    
}
