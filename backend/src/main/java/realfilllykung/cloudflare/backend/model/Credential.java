package realfilllykung.cloudflare.backend.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class Credential { 
    @NotBlank(message = "credentialName should not be blank")
    @NotNull(message = "credentialName should not be null")
    @Size(max = 50, message = "credentialName should not exceed 50 characters")
    private String credentialName;
    
    @NotBlank(message = "zoneIdentifierId should not be blank")
    @NotNull(message = "zoneIdentifierId should not be null")
    private String zoneIdentifierId;
    
    @NotBlank(message = "apiKey should not be blank")
    @NotNull(message = "apiKey should not be null")
    private String apiKey;

    @NotBlank(message = "email should not be blank")
    @NotNull(message = "email should not be null")
    @Email(message = "email should be a valid email address")
    private String email; 

    public Credential(String credentialName, String zoneIdentifierId, String apiKey, String email) {
        this.credentialName = credentialName;
        this.zoneIdentifierId = zoneIdentifierId;
        this.apiKey = apiKey;
        this.email = email;
    }
}