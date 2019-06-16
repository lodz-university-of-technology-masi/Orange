package pl.masi.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "test")
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "optimized-sequence")
    @Column(nullable = false, unique = true)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany
    @JoinTable(
            name = "test_question",
            joinColumns = {@JoinColumn(name = "test_id")},
            inverseJoinColumns = {@JoinColumn(name = "question_id")})
    private List<Question> questions;

    @ManyToOne
    @JoinColumn
    private Position position;

    @ManyToOne
    @JoinColumn(name="creator_username", referencedColumnName = "username")
    private Account creatorUsername;
}
