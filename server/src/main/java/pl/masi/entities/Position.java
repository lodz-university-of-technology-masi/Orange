package pl.masi.entities;

import lombok.*;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "position")
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "optimized-sequence")
    @Column(nullable = false, unique = true)
    private Long id;

    @NotNull
    @Length(min = 4, message = "Position name must contain at least 4 characters")
    @Column(nullable = false, unique = true)
    private String name;

    private boolean active;
}
