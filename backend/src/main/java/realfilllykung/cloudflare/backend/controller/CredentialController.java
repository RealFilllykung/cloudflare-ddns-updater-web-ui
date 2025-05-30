package realfilllykung.cloudflare.backend.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import realfilllykung.cloudflare.backend.models.Credential;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

import jakarta.validation.Valid;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

@RestController
public class CredentialController {


    @GetMapping("/credentials")
    public String getCredentials() {
        return "Hello World";
    }

    @PostMapping("/credentials")
    public Credential postMethodName(@Valid @RequestBody Credential credential) {
        return credential;
    }

    @PutMapping("path/{id}")
    public String putMethodName(@PathVariable String id, @RequestBody String entity) {
        return entity;
    }

    @DeleteMapping("/credentials/{id}")
    public String deleteMethodName(@PathVariable String id) {
        return "Deleted credential with id: " + id;
    }
    
}
