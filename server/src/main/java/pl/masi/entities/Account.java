package pl.masi.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.Length;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Entity
@Getter @Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator = "optimized-sequence")
    private Long id;

    @Column(unique = true)
    @NotNull
    @Length(min = 3, message = "Username must contain at least 3 characters")
    private String username;

    @Length(min = 60, max = 60)
    private String password;

    @NotNull(message = "Name can not be empty")
    @NotEmpty(message = "Name can not be empty")
    @Length(min = 2, message = "Name must contain at least 2 characters")
    private String firstName;

    @NotNull(message = "Surname can not be empty")
    @Length(min = 2, message = "Surname must contain at least 2 characters")
    private String lastName;

    @ManyToOne
    @JoinColumn
    private Permission permission;
}
