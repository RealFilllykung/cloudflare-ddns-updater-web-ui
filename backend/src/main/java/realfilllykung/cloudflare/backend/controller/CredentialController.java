package realfilllykung.cloudflare.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CredentialController {
    @GetMapping("/credentials")
    public String getCredentials() {
        return "Hello World";
    }
}
